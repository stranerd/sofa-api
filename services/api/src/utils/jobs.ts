import { deleteUnverifiedUsers } from '@modules/auth'
import { EmailErrorsUseCases, NotificationsUseCases, PhoneErrorsUseCases, sendMailAndCatchError, sendTextAndCatchError } from '@modules/notifications'
import { MethodsUseCases, processWithdrawals, renewSubscription, retryTransactions } from '@modules/payment'
import { GamesUseCases } from '@modules/plays'
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
			if (data.type === DelayedJobs.RenewSubscription) await renewSubscription(data.data.userId)
			if (data.type === DelayedJobs.GameTimer) await GamesUseCases.end({ id: data.data.gameId, userId: data.data.userId })
		},
		onCronLike: async () => { },
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const [emails, texts] = await Promise.all([
					EmailErrorsUseCases.getAndDeleteAll(),
					PhoneErrorsUseCases.getAndDeleteAll()
				])
				await Promise.all([
					retryTransactions(60 * 60 * 1000),
					processWithdrawals(60 * 60 * 1000),
					appInstance.job.retryAllFailedJobs(),
					emails.map((e) => sendMailAndCatchError(e as any)),
					texts.map((t) => sendTextAndCatchError(t))
				])
			}
			if (type === CronTypes.daily) {
				await UsersUseCases.resetRankings(UserRankings.daily)
				await deleteUnverifiedUsers()
			}
			if (type === CronTypes.weekly) {
				await UsersUseCases.resetRankings(UserRankings.weekly)
				await NotificationsUseCases.deleteOldSeen()
			}
			if (type === CronTypes.monthly) {
				await UsersUseCases.resetRankings(UserRankings.monthly)
				await MethodsUseCases.markExpireds()
			}
		}
	})
}