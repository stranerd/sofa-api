import type { QueryParams, Request } from 'equipped'
import { BadRequestError, QueryKeys, Schema, validate, Validation } from 'equipped'

import {
	findPurchasable,
	FlutterwavePayment,
	MethodsUseCases,
	Purchasables,
	PurchasesUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases,
} from '@modules/payment'

import { SelectedPaymentMethodSchema } from '.'

export class PurchasesController {
	static async find(req: Request) {
		const userId = req.authUser!.id
		const purchase = await PurchasesUseCases.find(req.params.id)
		if (!purchase) return null
		if (purchase.userId === userId || purchase.data.userId === userId) return purchase
		return null
	}

	static async get(req: Request) {
		const userId = req.authUser!.id
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'userId', value: userId },
			{ field: 'data.userId', value: userId },
		]
		return await PurchasesUseCases.get(query)
	}

	static async create(req: Request) {
		const { type, id, methodId } = validate(
			{
				type: Schema.in(Object.values(Purchasables)),
				id: Schema.string().min(1),
				methodId: SelectedPaymentMethodSchema,
			},
			req.body,
		)

		const userId = req.authUser!.id
		const purchase = await PurchasesUseCases.for({ userId, type, itemId: id })
		if (purchase) return true

		const purchasable = await findPurchasable(type, id)
		if (!purchasable || purchasable.frozen) throw new BadRequestError('item cannot be purchased')
		if (purchasable.userId === userId) throw new BadRequestError('cannot purchase owned item')
		const isFree = purchasable.price.amount === 0

		const payWithWallet = methodId === true
		const method = await MethodsUseCases.getForUser(userId, methodId)
		if (!isFree && !payWithWallet && !method) throw new BadRequestError('invalid method')

		const transaction = await TransactionsUseCases.create({
			userId,
			email: req.authUser!.email,
			amount: 0 - purchasable.price.amount,
			currency: purchasable.price.currency,
			status: TransactionStatus.initialized,
			title: `Purchasing ${Validation.capitalize(purchasable.title)}`,
			data: {
				type: TransactionType.purchase,
				purchase: {
					price: purchasable.price,
					userId,
					data: { type, id: purchasable.id, userId: purchasable.userId, title: purchasable.title },
				},
			},
		})
		let successful = false

		if (isFree) successful = true
		else {
			if (payWithWallet)
				successful = await WalletsUseCases.updateAmount({
					userId,
					amount: transaction.amount,
					currency: transaction.currency,
				})
			else {
				if (!method) throw new BadRequestError('invalid method')
				successful = await FlutterwavePayment.chargeCard({
					email: transaction.email,
					amount: transaction.amount,
					currency: transaction.currency,
					token: method.token,
					id: transaction.id,
				})
			}
		}

		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed },
		})

		return successful
	}
}
