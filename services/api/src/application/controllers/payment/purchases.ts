import { findPurchaseable, FlutterwavePayment, MethodsUseCases, Purchasables, PurchasesUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, QueryKeys, QueryParams, Request, Schema, validate, Validation } from 'equipped'

export class PurchasesController {
	static async find (req: Request) {
		const userId = req.authUser!.id
		const purchase = await PurchasesUseCases.find(req.params.id)
		if (!purchase) return null
		if (purchase.user.id === userId || purchase.data.userId === userId) return purchase
		return null
	}

	static async get (req: Request) {
		const userId = req.authUser!.id
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'user.id', value: userId },
			{ field: 'data.userId', value: userId }
		]
		return await PurchasesUseCases.get(query)
	}

	static async create (req: Request) {
		const { type, id } = validate({
			type: Schema.in(Object.values(Purchasables)),
			id: Schema.string().min(1),
		}, req.body)

		const userId = req.authUser!.id
		const purchase = await PurchasesUseCases.for({ userId, type, itemId: id })
		if (purchase) return true

		const purchaseable = await findPurchaseable(type, id)
		if (!purchaseable) throw new BadRequestError('item not found')

		const user = await UsersUseCases.find(userId)
		if (!user) throw new BadRequestError('profile not found')

		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - purchaseable.price.amount,
			currency: purchaseable.price.currency,
			status: TransactionStatus.initialized,
			title: `Purchasing ${Validation.capitalize(purchaseable.title)}`,
			data: {
				type: TransactionType.purchase,
				purchase: {
					price: purchaseable.price,
					user: user.getEmbedded(),
					data: { type, id: purchaseable.id, userId: purchaseable.user.id }
				}
			}
		})
		let successful = false

		if (purchaseable.price.amount === 0) successful = true
		else {
			const { methodId } = validate({ methodId: Schema.string().min(1) }, req.body)
			const method = await MethodsUseCases.find(methodId)
			if (!method || method.userId !== userId) throw new BadRequestError('invalid method')
			successful = await FlutterwavePayment.chargeCard({
				email: transaction.email, amount: Math.abs(transaction.amount), currency: transaction.currency,
				token: method.token, id: transaction.id
			})
		}

		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed }
		})

		return successful
	}
}