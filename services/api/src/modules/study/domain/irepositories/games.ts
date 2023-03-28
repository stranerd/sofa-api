import { QueryParams, QueryResults } from 'equipped'
import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { EmbeddedUser } from '../types'

export interface IGameRepository {
	add: (data: GameToModel) => Promise<GameEntity>
	get: (condition: QueryParams) => Promise<QueryResults<GameEntity>>
	find: (id: string) => Promise<GameEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}