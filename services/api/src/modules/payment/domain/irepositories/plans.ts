import type { QueryParams, QueryResults } from 'equipped'

import type { PlanToModel } from '../../data/models/plans'
import type { PlanEntity } from '../entities/plans'

export interface IPlanRepository {
	init: (data: PlanToModel[]) => Promise<PlanEntity[]>
	get: (query: QueryParams) => Promise<QueryResults<PlanEntity>>
	find: (id: string) => Promise<PlanEntity | null>
}
