import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ViewFromModel } from '../../data/models/views'
import { ViewEntity } from '../../domain/entities/views'

export const ViewDbChangeCallbacks: DbChangeCallbacks<ViewFromModel, ViewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('interactions/views', after)
		await appInstance.listener.created(`interactions/views/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('interactions/views', after)
		await appInstance.listener.updated(`interactions/views/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('interactions/views', before)
		await appInstance.listener.deleted(`interactions/views/${before.id}`, before)
	}
}