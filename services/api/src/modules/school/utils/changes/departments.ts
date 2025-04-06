import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import { CoursesUseCases } from '../..'
import type { DepartmentFromModel } from '../../data/models/departments'
import type { DepartmentEntity } from '../../domain/entities/departments'

export const DepartmentDbChangeCallbacks: DbChangeCallbacks<DepartmentFromModel, DepartmentEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['school/departments', `school/departments/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['school/departments', `school/departments/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['school/departments', `school/departments/${before.id}`], before)

		await CoursesUseCases.deleteDepartmentCourses(before.id)
	},
}
