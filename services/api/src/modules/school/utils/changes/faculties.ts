import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { DepartmentsUseCases } from '../..'
import { FacultyFromModel } from '../../data/models/faculties'
import { FacultyEntity } from '../../domain/entities/faculties'

export const FacultyDbChangeCallbacks: DbChangeCallbacks<FacultyFromModel, FacultyEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['school/faculties', `school/faculties/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['school/faculties', `school/faculties/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['school/faculties', `school/faculties/${before.id}`], before)

		await DepartmentsUseCases.deleteFacultyDepartments(before.id)
	}
}