import { UsersUseCases } from '@modules/users'
import { appInstance as purchases } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { TransactionsUseCases } from '../../'
import { PurchaseFromModel } from '../../data/models/purchases'
import { PurchaseEntity } from '../../domain/entities/purchases'
import { TransactionStatus, TransactionType } from '../../domain/types'

export const PurchaseDbChangeCallbacks: DbChangeCallbacks<PurchaseFromModel, PurchaseEntity> = {
	created: async ({ after }) => {
		await purchases.listener.created([
			`payment/purchases/${after.user.id}`,
			`payment/purchases/${after.data.userId}`,
			`payment/purchases/${after.id}/${after.user.id}`,
			`payment/purchases/${after.id}/${after.data.userId}`
		], after)

		const user = await UsersUseCases.find(after.data.userId)
		if (!user) return

		await TransactionsUseCases.create({
			title: `Purchase of ${after.data.type}: ${after.data.id}`,
			userId: user.id, email: user.bio.email,
			amount: after.price.amount, currency: after.price.currency,
			status: TransactionStatus.fulfilled,
			data: {
				type: TransactionType.purchased,
				purchaseId: after.id
			}
		})
	},
	updated: async ({ after }) => {
		await purchases.listener.updated([
			`payment/purchases/${after.user.id}`,
			`payment/purchases/${after.data.userId}`,
			`payment/purchases/${after.id}/${after.user.id}`,
			`payment/purchases/${after.id}/${after.data.userId}`
		], after)
	},
	deleted: async ({ before }) => {
		await purchases.listener.deleted([
			`payment/purchases/${before.user.id}`,
			`payment/purchases/${before.data.userId}`,
			`payment/purchases/${before.id}/${before.user.id}`,
			`payment/purchases/${before.id}/${before.data.userId}`
		], before)
	}
}