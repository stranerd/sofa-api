import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnnouncementsUseCases, SchedulesUseCases } from '../..'
import { ClassFromModel } from '../../data/models/classes'
import { ClassEntity } from '../../domain/entities/classes'

export const ClassDbChangeCallbacks: DbChangeCallbacks<ClassFromModel, ClassEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes`, `organizations/${after.organizationId}/classes/${after.id}`
		], after)

		await UsersUseCases.incrementMeta({ id: after.organizationId, property: UserMeta.classes, value: 1 })
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([
			`organizations/${after.organizationId}/classes`, `organizations/${after.organizationId}/classes/${after.id}`,
		], after)

		const beforeLessonsIds = before.lessons.map((lesson) => lesson.id)
		const afterLessonsIds = after.lessons.map((lesson) => lesson.id)
		const newLessonIds = afterLessonsIds.filter((id) => !beforeLessonsIds.includes(id))
		const deletedLessonIds = beforeLessonsIds.filter((id) => !afterLessonsIds.includes(id))

		await Promise.all([
			newLessonIds.length && UsersUseCases.incrementMeta({ id: after.organizationId, property: UserMeta.lessons, value: newLessonIds.length }),
			deletedLessonIds.length && UsersUseCases.incrementMeta({ id: before.organizationId, property: UserMeta.lessons, value: -deletedLessonIds.length }),
			...deletedLessonIds.map((id) => SchedulesUseCases.deleteLessonSchedules({ organizationId: after.organizationId, classId: after.id, lessonId: id }))
		])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`organizations/${before.organizationId}/classes`, `organizations/${before.organizationId}/classes/${before.id}`
		], before)

		await Promise.all([
			UsersUseCases.incrementMeta({ id: before.organizationId, property: UserMeta.classes, value: -1 }),
			UsersUseCases.removeSaved({ key: 'classes', values: [before.id] }),
			before.lessons.length && UsersUseCases.incrementMeta({ id: before.organizationId, property: UserMeta.lessons, value: -before.lessons.length }),
			AnnouncementsUseCases.deleteClassAnnouncements({ organizationId: before.organizationId, classId: before.id }),
			...before.lessons.map((l) => SchedulesUseCases.deleteLessonSchedules({ organizationId: before.organizationId, classId: before.id, lessonId: l.id })),
		])
	}
}
