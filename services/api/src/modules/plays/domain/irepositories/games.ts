import { QueryParams, QueryResults } from 'equipped'
import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { EmbeddedUser } from '../types'

export interface IGameRepository {
	add: (data: GameToModel) => Promise<GameEntity>
	get: (condition: QueryParams) => Promise<QueryResults<GameEntity>>
	find: (id: string) => Promise<GameEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	start: (id: string, userId: string) => Promise<GameEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	join: (id: string, userId: string, join: boolean) => Promise<GameEntity | null>
	end: (id: string, userId: string) => Promise<GameEntity | null>
	score: (id: string, userId: string, scores: Record<string, number>) => Promise<GameEntity | null>
}