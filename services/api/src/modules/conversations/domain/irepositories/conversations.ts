import { QueryParams, QueryResults } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
import { MessageFromModel } from '../../data/models/messages'
import { ConversationEntity } from '../entities/conversations'
import { EmbeddedUser } from '../types'
import { TutorRequestEntity } from '../entities/tutorRequests'

export interface IConversationRepository {
	add: (data: ConversationToModel) => Promise<ConversationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConversationEntity>>
	find: (id: string) => Promise<ConversationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	update: (id: string, userId: string, data: Partial<ConversationToModel>) => Promise<ConversationEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	removeTutor: (data: { conversationId: string, userId: string }) => Promise<{ conversation: ConversationEntity | null, tutorRequest: TutorRequestEntity | null }>
	updateLastMessage: (message: MessageFromModel) => Promise<void>
}