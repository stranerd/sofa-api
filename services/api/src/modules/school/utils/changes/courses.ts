import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { CourseFromModel } from '../../data/models/courses'
import type { CourseEntity } from '../../domain/entities/courses'

export const CourseDbChangeCallbacks: DbChangeCallbacks<CourseFromModel, CourseEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['school/courses', `school/courses/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['school/courses', `school/courses/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['school/courses', `school/courses/${before.id}`], before)
	},
}
