import { DbChangeCallbacks } from 'equipped'
import { appInstance } from '@utils/types'
import { fulfillTransaction } from '../transactions'
import { TransactionFromModel } from '../../data/models/transactions'
import { TransactionEntity } from '../../domain/entities/transactions'
import { TransactionStatus } from '../../domain/types'

export const TransactionDbChangeCallbacks: DbChangeCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`payment/transactions/${after.userId}`, after)
		await appInstance.listener.created(`payment/transactions/${after.id}/${after.userId}`, after)

		if (after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(`payment/transactions/${after.userId}`, after)
		await appInstance.listener.updated(`payment/transactions/${after.id}/${after.userId}`, after)

		if (changes.status) {
			if (before.status === TransactionStatus.initialized && after.status === TransactionStatus.fulfilled) await fulfillTransaction(after)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`payment/transactions/${before.userId}`, before)
		await appInstance.listener.deleted(`payment/transactions/${before.id}/${before.userId}`, before)
	}
}