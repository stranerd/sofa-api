import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnnouncementsUseCases, LessonsUseCases } from '../..'
import { ClassFromModel } from '../../data/models/classes'
import { ClassEntity } from '../../domain/entities/classes'

export const ClassDbChangeCallbacks: DbChangeCallbacks<ClassFromModel, ClassEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes`, `organizations/${after.organizationId}/classes/${after.id}`
		], after)

		await UsersUseCases.incrementMeta({ id: after.organizationId, property: UserMeta.classes, value: 1 })
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

		await Promise.all([
			UsersUseCases.incrementMeta({ id: before.organizationId, property: UserMeta.classes, value: -1 }),
			LessonsUseCases.deleteClassLessons({ organizationId: before.organizationId, classId: before.id }),
			AnnouncementsUseCases.deleteClassAnnouncements({ organizationId: before.organizationId, classId: before.id }),
		])
	}
}
