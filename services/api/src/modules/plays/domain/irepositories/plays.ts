import type { QueryParams, QueryResults } from 'equipped'

import type { PlayToModel } from '../../data/models/plays'
import type { PlayEntity } from '../entities/plays'
import type { EmbeddedUser, PlayScore } from '../types'

export interface IPlayRepository {
	add: (data: PlayToModel) => Promise<PlayEntity>
	get: (condition: QueryParams) => Promise<QueryResults<PlayEntity>>
	find: (id: string) => Promise<PlayEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	start: (id: string, userId: string) => Promise<PlayEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	end: (id: string, userId: string) => Promise<PlayEntity | null>
	score: (id: string, userId: string, scores: PlayScore) => Promise<PlayEntity | null>
	join: (id: string, userId: string, join: boolean) => Promise<PlayEntity | null>
}
