import type { QueryParams, QueryResults } from 'equipped'

import type { FacultyToModel } from '../../data/models/faculties'
import type { FacultyEntity } from '../entities/faculties'

export interface IFacultyRepository {
	add: (data: FacultyToModel) => Promise<FacultyEntity>
	update: (id: string, data: Partial<FacultyToModel>) => Promise<FacultyEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<FacultyEntity>>
	find: (id: string) => Promise<FacultyEntity | null>
	delete: (id: string) => Promise<boolean>
	deleteInstitutionFaculties: (institutionId: string) => Promise<boolean>
}
