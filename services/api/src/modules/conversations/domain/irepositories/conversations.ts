import { QueryParams, QueryResults } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
import { ConversationEntity } from '../entities/conversations'
import { EmbeddedUser } from '../types'

export interface IConversationRepository {
	add: (data: ConversationToModel) => Promise<ConversationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConversationEntity>>
	find: (id: string) => Promise<ConversationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	setTutor: (id: string, userId: string, tutor: EmbeddedUser | null) => Promise<ConversationEntity | null>
}