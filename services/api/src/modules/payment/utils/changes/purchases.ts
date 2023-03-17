import { appInstance as purchases } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { PurchaseFromModel } from '../../data/models/purchases'
import { PurchaseEntity } from '../../domain/entities/purchases'

export const PurchaseDbChangeCallbacks: DbChangeCallbacks<PurchaseFromModel, PurchaseEntity> = {
	created: async ({ after }) => {
		await purchases.listener.created([
			`payment/purchases/${after.user.id}`,
			`payment/purchases/${after.data.userId}`,
			`payment/purchases/${after.id}/${after.user.id}`,
			`payment/purchases/${after.id}/${after.data.userId}`
		], after)
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