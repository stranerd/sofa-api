import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import { DepartmentsUseCases } from '../..'
import type { FacultyFromModel } from '../../data/models/faculties'
import type { FacultyEntity } from '../../domain/entities/faculties'

export const FacultyDbChangeCallbacks: DbChangeCallbacks<FacultyFromModel, FacultyEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['school/faculties', `school/faculties/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['school/faculties', `school/faculties/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['school/faculties', `school/faculties/${before.id}`], before)

		await DepartmentsUseCases.deleteFacultyDepartments(before.id)
	},
}
