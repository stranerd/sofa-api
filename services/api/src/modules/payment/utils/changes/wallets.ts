import { AuthUsersUseCases } from '@modules/auth'
import { appInstance } from '@utils/types'
import { AuthRole, DbChangeCallbacks } from 'equipped'
import { WalletFromModel } from '../../data/models/wallets'
import { WalletEntity } from '../../domain/entities/wallets'

export const WalletDbChangeCallbacks: DbChangeCallbacks<WalletFromModel, WalletEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/wallets/${after.userId}`,
			`payment/wallets/${after.id}/${after.userId}`
		], after)

		await AuthUsersUseCases.updateUserRole({
			userId: after.userId, roles: { [AuthRole.isSubscribed]: after.subscription.active }
		})
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated([
			`payment/wallets/${after.userId}`,
			`payment/wallets/${after.id}/${after.userId}`
		], after)

		if (changes.subscription?.active) await AuthUsersUseCases.updateUserRole({
			userId: after.userId, roles: { [AuthRole.isSubscribed]: after.subscription.active }
		})
		if (before.subscription.current?.jobId !== after.subscription.current?.jobId && before.subscription.current?.jobId) await appInstance.job.removeDelayedJob(before.subscription.current.jobId)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/wallets/${before.userId}`,
			`payment/wallets/${before.id}/${before.userId}`
		], before)

		await AuthUsersUseCases.updateUserRole({
			userId: before.userId, roles: { [AuthRole.isSubscribed]: before.subscription.active }
		})
		if (before.subscription.current?.jobId) await appInstance.job.removeDelayedJob(before.subscription.current.jobId)
	}
}