import { ConversationsUseCases } from '..'
import { ConversationEntity } from '../domain/entities/conversations'

export const canAccessConversation = async (conversationId: string, userId: string, conv?: ConversationEntity) => {
	const conversation = conv ?? await ConversationsUseCases.find(conversationId)
	return conversation?.user.id === userId
}