import type { QueryParams, QueryResults } from 'equipped'

import type { LikeToModel } from '../../data/models/likes'
import type { LikeEntity } from '../entities/likes'
import type { Interaction } from '../types'

export interface ILikeRepository {
	like: (data: LikeToModel) => Promise<LikeEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<LikeEntity>>
	find: (id: string) => Promise<LikeEntity | null>
	deleteEntityLikes: (entity: Interaction) => Promise<boolean>
	updateUserBio: (user: LikeToModel['user']) => Promise<boolean>
}
