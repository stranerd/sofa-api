import { PlayTypes } from '@modules/plays'
import { DelayedJobs } from 'equipped'

declare module 'equipped/lib/bull' {
	interface DelayedJobEvents {
		[DelayedJobs.RenewSubscription]: {
			type: typeof DelayedJobs.RenewSubscription,
			data: { userId: string }
		},
		[DelayedJobs.PlayTimer]: {
			type: typeof DelayedJobs.PlayTimer,
			data: { type: PlayTypes, typeId: string, userId: string }
		}
	}

	interface CronLikeJobEvents { }
}