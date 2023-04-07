import { QueryParams, QueryResults } from 'equipped'
import { ReviewToModel } from '../../data/models/reviews'
import { ReviewEntity } from '../entities/reviews'
import { EmbeddedUser } from '../types'

export interface IReviewRepository {
	get: (condition: QueryParams) => Promise<QueryResults<ReviewEntity>>
	find: (id: string) => Promise<ReviewEntity | null>
	update: (id: string, userId: string, data: Partial<ReviewToModel>) => Promise<ReviewEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}