import type { QueryParams, QueryResults } from 'equipped'

import type { MessageToModel } from '../../data/models/messages'
import type { MessageEntity } from '../entities/messages'

export interface IMessageRepository {
	add: (data: MessageToModel) => Promise<MessageEntity>
	get: (condition: QueryParams) => Promise<QueryResults<MessageEntity>>
	find: (id: string) => Promise<MessageEntity | null>
	star: (conversationId: string, id: string, userId: string, starred: boolean) => Promise<MessageEntity | null>
	deleteConversationMessages: (conversationId: string) => Promise<boolean>
	markRead: (userId: string, conversationId: string) => Promise<boolean>
}
