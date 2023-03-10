import { QueryParams, QueryResults } from 'equipped'
import { CardToModel } from '../../data/models/cards'
import { CardEntity } from '../entities/cards'
import { EmbeddedUser } from '../types'

export interface ICardRepository {
	add: (data: CardToModel) => Promise<CardEntity>
	get: (condition: QueryParams) => Promise<QueryResults<CardEntity>>
	find: (id: string) => Promise<CardEntity | null>
	update: (id: string, userId: string, data: Partial<CardToModel>) => Promise<CardEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	saveMatch: (flashCardId: string, userId: string, time: number) => Promise<{ time: number, record: boolean }>
}