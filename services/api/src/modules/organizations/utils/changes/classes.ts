import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ClassFromModel } from '../../data/models/classes'
import { ClassEntity } from '../../domain/entities/classes'

export const ClassDbChangeCallbacks: DbChangeCallbacks<ClassFromModel, ClassEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes`, `organizations/${after.organizationId}/classes/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes`, `organizations/${after.organizationId}/classes/${after.id}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`organizations/${before.organizationId}/classes`, `organizations/${before.organizationId}/classes/${before.id}`
		], before)
	}
}
