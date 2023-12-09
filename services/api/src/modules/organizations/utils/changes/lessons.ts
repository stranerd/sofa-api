import { SchedulesUseCases } from '@modules/organizations'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { LessonFromModel } from '../../data/models/lessons'
import { LessonEntity } from '../../domain/entities/lessons'
import { UsersUseCases, UserMeta } from '@modules/users'


export const LessonDbChangeCallbacks: DbChangeCallbacks<LessonFromModel, LessonEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes/${after.classId}/lessons`,
			`organizations/${after.organizationId}/classes/${after.classId}/lessons/${after.id}`
		], after)

		await UsersUseCases.incrementMeta({ id: after.organizationId, property: UserMeta.lessons, value: 1 })
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes/${after.classId}/lessons`,
			`organizations/${after.organizationId}/classes/${after.classId}/lessons/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`organizations/${before.organizationId}/classes/${before.classId}/lessons`,
			`organizations/${before.organizationId}/classes/${before.classId}/lessons/${before.id}`
		], before)

		await UsersUseCases.incrementMeta({ id: before.organizationId, property: UserMeta.lessons, value: -1 })

		await SchedulesUseCases.deleteLessonSchedules({ organizationId: before.organizationId, classId: before.classId, lessonId: before.id })
	}
}