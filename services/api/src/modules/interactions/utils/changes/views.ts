import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { ViewFromModel } from '../../data/models/views'
import type { ViewEntity } from '../../domain/entities/views'

export const ViewDbChangeCallbacks: DbChangeCallbacks<ViewFromModel, ViewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.user.id, after.entity.userId]
				.map((uid) => [`interactions/views/${uid}`, `interactions/views/${after.id}/${uid}`])
				.flat(),
			after,
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[after.user.id, after.entity.userId]
				.map((uid) => [`interactions/views/${uid}`, `interactions/views/${after.id}/${uid}`])
				.flat(),
			{ after, before },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.user.id, before.entity.userId]
				.map((uid) => [`interactions/views/${uid}`, `interactions/views/${before.id}/${uid}`])
				.flat(),
			before,
		)
	},
}
