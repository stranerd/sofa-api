import { QueryParams, QueryResults } from 'equipped'
import { MessageToModel } from '../../data/models/messages'
import { MessageEntity } from '../entities/messages'

export interface IMessageRepository {
	add: (data: MessageToModel) => Promise<MessageEntity>
	get: (condition: QueryParams) => Promise<QueryResults<MessageEntity>>
	find: (id: string) => Promise<MessageEntity | null>
	star: (conversationId: string, id: string, userId: string, starred: boolean) => Promise<MessageEntity | null>
	deleteConversationMessages: (conversationId: string) => Promise<boolean>
}