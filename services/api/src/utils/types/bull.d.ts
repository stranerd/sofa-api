import type { DelayedJobs } from 'equipped'

import type { Subscription } from '@modules/payment'
import type { PlayTypes } from '@modules/plays'

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
		[DelayedJobs.PlayAnswerTimer]: {
			type: typeof DelayedJobs.PlayAnswerTimer
			data: { type: PlayTypes; typeId: string; userId: string }
		}
	}

	interface CronLikeJobEvents {}
}
