import { DelayedJobs } from 'equipped'
import { Subscription } from '@modules/payment'

declare module 'equipped/lib/bull' {
	interface DelayedJobEvents {
		[DelayedJobs.RenewSubscription]: {
			type: typeof DelayedJobs.RenewSubscription
			data: { userId: string }
		}
		[DelayedJobs.RenewGenericSubscription]: {
			type: typeof DelayedJobs.RenewGenericSubscription
			data: { userId: string; data: Subscription['data'] }
		}
		[DelayedJobs.PlayTimer]: {
			type: typeof DelayedJobs.PlayTimer
			data: { type: string; typeId: string; userId: string }
		}
	}

	interface CronLikeJobEvents {}
}
