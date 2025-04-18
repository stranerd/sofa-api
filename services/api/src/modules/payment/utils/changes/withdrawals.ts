import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { WithdrawalFromModel } from '../../data/models/withdrawals'
import type { WithdrawalEntity } from '../../domain/entities/withdrawals'
import { WithdrawalStatus } from '../../domain/types'
import { processCompletedWithdrawal, processCreatedWithdrawal, processFailedWithdrawal, processInProgressWithdrawal } from '../withdrawals'

export const WithdrawalDbChangeCallbacks: DbChangeCallbacks<WithdrawalFromModel, WithdrawalEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[`payment/withdrawals/${after.userId}`, `payment/withdrawals/${after.id}/${after.userId}`],
			after,
		)

		await processCreatedWithdrawal(after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated([`payment/withdrawals/${after.userId}`, `payment/withdrawals/${after.id}/${after.userId}`], {
			after,
			before,
		})

		if (changes.status) {
			if (before.status === WithdrawalStatus.created && after.status === WithdrawalStatus.inProgress)
				await processInProgressWithdrawal(after)
			if (before.status === WithdrawalStatus.inProgress && after.status === WithdrawalStatus.failed)
				await processFailedWithdrawal(after)
			if (before.status === WithdrawalStatus.inProgress && after.status === WithdrawalStatus.completed)
				await processCompletedWithdrawal(after)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[`payment/withdrawals/${before.userId}`, `payment/withdrawals/${before.id}/${before.userId}`],
			before,
		)
	},
}
