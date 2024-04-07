import { deleteUnverifiedUsers } from '@modules/auth'
import {
	EmailErrorsUseCases,
	NotificationsUseCases,
	PhoneErrorsUseCases,
	sendMailAndCatchError,
	sendTextAndCatchError,
} from '@modules/notifications'
import { MethodsUseCases, Subscriptions, processTransactions, processWithdrawals, updateOrgsMembersDays } from '@modules/payment'
import { AnswersUseCases, PlaysUseCases } from '@modules/plays'
import { UserRankings, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { CronTypes, DelayedJobs } from 'equipped'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues(
		[
			{ name: CronTypes.hourly, cron: '0 * * * *' },
			{ name: CronTypes.daily, cron: '0 0 * * *' },
			{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
			{ name: CronTypes.monthly, cron: '0 0 1 * *' },
		],
		{
			onDelayed: async (data) => {
				if (data.type === DelayedJobs.RenewSubscription) await Subscriptions.renewPlan(data.data.userId)
				if (data.type === DelayedJobs.RenewGenericSubscription) await Subscriptions.renewGeneric(data.data.userId, data.data.data)
				if (data.type === DelayedJobs.PlayTimer) await PlaysUseCases.end({ id: data.data.typeId, userId: data.data.userId })
				if (data.type === DelayedJobs.PlayAnswerTimer)
					await AnswersUseCases.end({ type: data.data.type, typeId: data.data.typeId, userId: data.data.userId })
			},
			onCronLike: async () => {},
			onCron: async (type) => {
				if (type === CronTypes.hourly) {
					const [emails, texts] = await Promise.all([
						EmailErrorsUseCases.getAndDeleteAll(),
						PhoneErrorsUseCases.getAndDeleteAll(),
					])
					await Promise.all([
						processTransactions(60 * 60 * 1000),
						processWithdrawals(60 * 60 * 1000),
						appInstance.job.retryAllFailedJobs(),
						...emails.map((e) => sendMailAndCatchError(e as any)),
						...texts.map((t) => sendTextAndCatchError(t)),
					])
				}
				if (type === CronTypes.daily) {
					await Promise.all([UsersUseCases.resetRankings(UserRankings.daily), deleteUnverifiedUsers(), updateOrgsMembersDays()])
				}
				if (type === CronTypes.weekly) {
					await Promise.all([UsersUseCases.resetRankings(UserRankings.weekly), NotificationsUseCases.deleteOldSeen()])
				}
				if (type === CronTypes.monthly) {
					await Promise.all([UsersUseCases.resetRankings(UserRankings.monthly), MethodsUseCases.markExpireds()])
				}
			},
		},
	)
}
