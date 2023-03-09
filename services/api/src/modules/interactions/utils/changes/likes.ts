import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { LikeFromModel } from '../../data/models/likes'
import { LikeEntity } from '../../domain/entities/likes'

export const LikeDbChangeCallbacks: DbChangeCallbacks<LikeFromModel, LikeEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('interactions/likes', after)
		await appInstance.listener.created(`interactions/likes/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('interactions/likes', after)
		await appInstance.listener.updated(`interactions/likes/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('interactions/likes', before)
		await appInstance.listener.deleted(`interactions/likes/${before.id}`, before)
	}
}