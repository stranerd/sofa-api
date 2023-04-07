import { QueryParams, QueryResults } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
import { MessageFromModel } from '../../data/models/messages'
import { ReviewToModel } from '../../data/models/reviews'
import { ConversationEntity } from '../entities/conversations'
import { EmbeddedUser } from '../types'

export interface IConversationRepository {
	add: (data: ConversationToModel) => Promise<ConversationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConversationEntity>>
	find: (id: string) => Promise<ConversationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	addTutor: (id: string, userId: string, tutor: EmbeddedUser) => Promise<ConversationEntity | null>
	removeTutor: (data: Omit<ReviewToModel, 'to'>) => Promise<ConversationEntity | null>
	updateLastMessage: (message: MessageFromModel) => Promise<void>
}