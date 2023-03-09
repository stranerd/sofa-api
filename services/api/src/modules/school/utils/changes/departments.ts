import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { CoursesUseCases } from '../..'
import { DepartmentFromModel } from '../../data/models/departments'
import { DepartmentEntity } from '../../domain/entities/departments'

export const DepartmentDbChangeCallbacks: DbChangeCallbacks<DepartmentFromModel, DepartmentEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('school/departments', after)
		await appInstance.listener.created(`school/departments/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('school/departments', after)
		await appInstance.listener.updated(`school/departments/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('school/departments', before)
		await appInstance.listener.deleted(`school/departments/${before.id}`, before)

		await CoursesUseCases.deleteDepartmentCourses(before.id)
	}
}