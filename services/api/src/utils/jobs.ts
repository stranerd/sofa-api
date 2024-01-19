import { deleteUnverifiedUsers } from '@modules/auth'
import { EmailErrorsUseCases, NotificationsUseCases, PhoneErrorsUseCases, sendMailAndCatchError, sendTextAndCatchError } from '@modules/notifications'
import { MethodsUseCases, processTransactions, processWithdrawals, renewPlanSubscription, renewSubscriptionTo, updateOrgsMembersDays } from '@modules/payment'
import { PlayTypes, endPlay } from '@modules/plays'
import { UserRankings, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { CronTypes, DelayedJobs } from 'equipped'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async (data) => {
			if (data.type === DelayedJobs.RenewSubscription) await renewPlanSubscription(data.data.userId)
			if (data.type === DelayedJobs.RenewGenericSubscription) await renewSubscriptionTo(data.data.userId, data.data.data)
			if (data.type === DelayedJobs.PlayTimer) await endPlay(data.data.type as PlayTypes, data.data.typeId, data.data.userId)
		},
		onCronLike: async () => { },
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const [emails, texts] = await Promise.all([
					EmailErrorsUseCases.getAndDeleteAll(),
					PhoneErrorsUseCases.getAndDeleteAll()
				])
				await Promise.all([
					processTransactions(60 * 60 * 1000),
					processWithdrawals(60 * 60 * 1000),
					appInstance.job.retryAllFailedJobs(),
					...emails.map((e) => sendMailAndCatchError(e as any)),
					...texts.map((t) => sendTextAndCatchError(t))
				])
			}
			if (type === CronTypes.daily) {
				await Promise.all([
					UsersUseCases.resetRankings(UserRankings.daily),
					deleteUnverifiedUsers(),
					updateOrgsMembersDays()
				])
			}
			if (type === CronTypes.weekly) {
				await Promise.all([
					UsersUseCases.resetRankings(UserRankings.weekly),
					NotificationsUseCases.deleteOldSeen(),
				])
			}
			if (type === CronTypes.monthly) {
				await Promise.all([
					UsersUseCases.resetRankings(UserRankings.monthly),
					MethodsUseCases.markExpireds()
				])
			}
		}
	})
}