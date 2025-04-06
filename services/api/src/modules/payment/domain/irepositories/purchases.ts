import type { QueryParams, QueryResults } from 'equipped'

import type { PurchaseToModel } from '../../data/models/purchases'
import type { PurchaseEntity } from '../entities/purchases'

export interface IPurchaseRepository {
	create: (data: PurchaseToModel) => Promise<PurchaseEntity>
	get: (query: QueryParams) => Promise<QueryResults<PurchaseEntity>>
	find: (id: string) => Promise<PurchaseEntity | null>
}
