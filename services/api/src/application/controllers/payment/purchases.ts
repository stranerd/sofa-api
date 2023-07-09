import { findPurchasable, FlutterwavePayment, MethodsUseCases, Purchasables, PurchasesUseCases, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
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
		const { type, id, methodId } = validate({
			type: Schema.in(Object.values(Purchasables)),
			id: Schema.string().min(1),
			methodId: Schema.string().default('')
		}, req.body)

		const userId = req.authUser!.id
		const purchase = await PurchasesUseCases.for({ userId, type, itemId: id })
		if (purchase) return true

		const purchasable = await findPurchasable(type, id)
		if (!purchasable || purchasable.frozen) throw new BadRequestError('item cannot be purchased')
		const isFree = purchasable.price.amount === 0

		const user = await UsersUseCases.find(userId)
		if (!user) throw new BadRequestError('profile not found')

		const method = await MethodsUseCases.find(methodId)
		if (!isFree && (!method || method.userId !== userId)) throw new BadRequestError('invalid method')

		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - purchasable.price.amount,
			currency: purchasable.price.currency,
			status: TransactionStatus.initialized,
			title: `Purchasing ${Validation.capitalize(purchasable.title)}`,
			data: {
				type: TransactionType.purchase,
				purchase: {
					price: purchasable.price,
					user: user.getEmbedded(),
					data: { type, id: purchasable.id, userId: purchasable.user.id }
				}
			}
		})
		let successful = false

		if (isFree) successful = true
		else {
			if (!method) throw new BadRequestError('invalid method')
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