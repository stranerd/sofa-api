import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { WithdrawalFromModel } from '../../data/models/withdrawals'
import { WithdrawalEntity } from '../../domain/entities/withdrawals'

export const WithdrawalDbChangeCallbacks: DbChangeCallbacks<WithdrawalFromModel, WithdrawalEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/withdrawals/${after.userId}`,
			`payment/withdrawals/${after.id}/${after.userId}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`payment/withdrawals/${after.userId}`,
			`payment/withdrawals/${after.id}/${after.userId}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/withdrawals/${before.userId}`,
			`payment/withdrawals/${before.id}/${before.userId}`
		], before)
	}
}