import { DelayedJobs } from 'equipped'

declare module 'equipped/lib/bull' {
    interface DelayedJobEvents {
		[DelayedJobs.RenewSubscription]: {
			type: typeof DelayedJobs.RenewSubscription,
			data: { userId: string }
		},
	}

    interface CronLikeJobEvents {}
}