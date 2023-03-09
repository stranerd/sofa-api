import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { CourseFromModel } from '../../data/models/courses'
import { CourseEntity } from '../../domain/entities/courses'

export const CourseDbChangeCallbacks: DbChangeCallbacks<CourseFromModel, CourseEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('school/courses', after)
		await appInstance.listener.created(`school/courses/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('school/courses', after)
		await appInstance.listener.updated(`school/courses/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('school/courses', before)
		await appInstance.listener.deleted(`school/courses/${before.id}`, before)
	}
}