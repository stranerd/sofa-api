import type { QueryParams, QueryResults } from 'equipped'

import type { InstitutionToModel } from '../../data/models/institutions'
import type { InstitutionEntity } from '../entities/institutions'

export interface IInstitutionRepository {
	add: (data: InstitutionToModel) => Promise<InstitutionEntity>
	update: (id: string, data: Partial<InstitutionToModel>) => Promise<InstitutionEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<InstitutionEntity>>
	find: (id: string) => Promise<InstitutionEntity | null>
	delete: (id: string) => Promise<boolean>
}
