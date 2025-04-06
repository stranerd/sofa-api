import type { QueryParams, QueryResults } from 'equipped'

import type { ViewToModel } from '../../data/models/views'
import type { ViewEntity } from '../entities/views'
import type { Interaction } from '../types'

export interface IViewRepository {
	add: (data: ViewToModel) => Promise<ViewEntity>
	get: (query: QueryParams) => Promise<QueryResults<ViewEntity>>
	find: (id: string) => Promise<ViewEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	deleteEntityViews: (entity: Interaction) => Promise<boolean>
	updateUserBio: (user: ViewToModel['user']) => Promise<boolean>
}
