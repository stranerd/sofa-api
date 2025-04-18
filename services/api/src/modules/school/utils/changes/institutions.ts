import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import { CoursesUseCases, FacultiesUseCases } from '../..'
import type { InstitutionFromModel } from '../../data/models/institutions'
import type { InstitutionEntity } from '../../domain/entities/institutions'

export const InstitutionDbChangeCallbacks: DbChangeCallbacks<InstitutionFromModel, InstitutionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['school/institutions', `school/institutions/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['school/institutions', `school/institutions/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['school/institutions', `school/institutions/${before.id}`], before)

		await CoursesUseCases.deleteInstitutionCourses(before.id)
		await FacultiesUseCases.deleteInstitutionFaculties(before.id)
	},
}
