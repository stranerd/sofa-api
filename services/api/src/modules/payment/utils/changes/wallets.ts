import { AuthUsersUseCases } from '@modules/auth'
import { ClassesUseCases } from '@modules/organizations'
import { appInstance } from '@utils/types'
import { AuthRole, DbChangeCallbacks } from 'equipped'
import { WalletFromModel } from '../../data/models/wallets'
import { WalletEntity } from '../../domain/entities/wallets'
import { Subscription } from '../../domain/types'

export const WalletDbChangeCallbacks: DbChangeCallbacks<WalletFromModel, WalletEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([`payment/wallets/${after.userId}`, `payment/wallets/${after.id}/${after.userId}`], after)

		await AuthUsersUseCases.updateUserRole({
			userId: after.userId,
			roles: { [AuthRole.isSubscribed]: after.subscription.active },
		})
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated([`payment/wallets/${after.userId}`, `payment/wallets/${after.id}/${after.userId}`], after)

		if (changes.subscription?.active)
			await AuthUsersUseCases.updateUserRole({
				userId: after.userId,
				roles: { [AuthRole.isSubscribed]: after.subscription.active },
			})

		const removedJobIds: string[] = []
		if (before.subscription.current?.jobId !== after.subscription.current?.jobId && before.subscription.current?.jobId)
			removedJobIds.push(before.subscription.current.jobId)

		if (changes.subscriptions) {
			const newSubs: Subscription[] = []
			const oldSubs: Subscription[] = []

			after.subscriptions.forEach((s) => {
				const old = before.getSubscription(s.data)
				if (!old) return s.active && newSubs.push(s)
				if (s.current?.jobId !== old.current?.jobId && old.current?.jobId) removedJobIds.push(old.current.jobId)
				if (s.active !== old.active) return (s.active ? newSubs : oldSubs).push(s)
				return
			})

			before.subscriptions.forEach((s) => {
				if (!after.getSubscription(s.data)) {
					if (s.current?.jobId) removedJobIds.push(s.current.jobId)
					return s.active && oldSubs.push(s)
				}
				// no need to handle prev exisiting subs cos they are already handled in the after block
				return
			})

			const newClasses = newSubs
				.map((s) => {
					if (s.data.type === 'classes') return { organizationId: s.data.organizationId, classId: s.data.classId }
					return null!
				})
				.filter(Boolean)

			const oldClasses = oldSubs
				.map((s) => {
					if (s.data.type === 'classes') return { organizationId: s.data.organizationId, classId: s.data.classId }
					return null!
				})
				.filter(Boolean)

			await Promise.all([
				...newClasses.map(({ organizationId, classId }) =>
					ClassesUseCases.manageMembers({
						organizationId,
						classId,
						userIds: [after.userId],
						add: true,
						type: 'students',
					}),
				),
				...oldClasses.map(({ organizationId, classId }) =>
					ClassesUseCases.manageMembers({
						organizationId,
						classId,
						userIds: [after.userId],
						add: false,
						type: 'students',
					}),
				),
			])
		}

		if (removedJobIds.length) await Promise.all(removedJobIds.map(appInstance.job.removeDelayedJob))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([`payment/wallets/${before.userId}`, `payment/wallets/${before.id}/${before.userId}`], before)

		await AuthUsersUseCases.updateUserRole({
			userId: before.userId,
			roles: { [AuthRole.isSubscribed]: before.subscription.active },
		})
		if (before.subscription.current?.jobId) await appInstance.job.removeDelayedJob(before.subscription.current.jobId)
	},
}
