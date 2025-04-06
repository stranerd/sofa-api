import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { TagFromModel } from '../../data/models/tags'
import type { TagEntity } from '../../domain/entities/tags'

export const TagDbChangeCallbacks: DbChangeCallbacks<TagFromModel, TagEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/tags', `interactions/tags/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['interactions/tags', `interactions/tags/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/tags', `interactions/tags/${before.id}`], before)
	},
}
