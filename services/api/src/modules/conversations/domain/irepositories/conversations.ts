import { QueryParams, QueryResults } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
import { MessageFromModel } from '../../data/models/messages'
import { ConversationEntity } from '../entities/conversations'
import { EmbeddedUser } from '../types'

export interface IConversationRepository {
	add: (data: ConversationToModel) => Promise<ConversationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConversationEntity>>
	find: (id: string) => Promise<ConversationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	update: (id: string, userId: string, data: Partial<ConversationToModel>) => Promise<ConversationEntity | null>
	accept: (data: { id: string; tutorId: string; accept: boolean }) => Promise<ConversationEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	end: (data: { conversationId: string; userId: string; rating: number; message: string }) => Promise<ConversationEntity | null>
	updateLastMessage: (message: MessageFromModel) => Promise<void>
}
