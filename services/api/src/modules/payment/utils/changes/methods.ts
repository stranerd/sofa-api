import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { MethodFromModel } from '../../data/models/methods'
import type { MethodEntity } from '../../domain/entities/methods'

export const MethodDbChangeCallbacks: DbChangeCallbacks<MethodFromModel, MethodEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([`payment/methods/${after.userId}`, `payment/methods/${after.id}/${after.userId}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([`payment/methods/${after.userId}`, `payment/methods/${after.id}/${after.userId}`], {
			after,
			before,
		})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([`payment/methods/${before.userId}`, `payment/methods/${before.id}/${before.userId}`], before)
	},
}
