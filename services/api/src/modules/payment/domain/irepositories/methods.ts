import type { QueryParams, QueryResults } from 'equipped'

import type { MethodToModel } from '../../data/models/methods'
import type { MethodEntity } from '../entities/methods'

export interface IMethodRepository {
	create: (data: MethodToModel) => Promise<MethodEntity>
	get: (query: QueryParams) => Promise<QueryResults<MethodEntity>>
	find: (id: string) => Promise<MethodEntity | null>
	makePrimary: (id: string, userId: string) => Promise<MethodEntity | null>
	markExpireds: () => Promise<boolean>
	delete: (id: string, userId: string) => Promise<boolean>
}
