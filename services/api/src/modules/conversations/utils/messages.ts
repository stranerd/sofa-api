import { AI } from '@utils/ai'
import { MessagesUseCases } from '..'
import { ConversationEntity } from '../domain/entities/conversations'
import { MessageEntity } from '../domain/entities/messages'

export const generateResponse = async (message: MessageEntity) => {
	if (!message.tags.includes(ConversationEntity.AI_Id)) return

	const response = await AI.replyMessage(message.body).catch(() => null)
	if (!response) return

	await MessagesUseCases.add({
		body: response, media: null,
		tags: [message.userId],
		conversationId: message.conversationId,
		userId: ConversationEntity.AI_Id,
		starred: false
	})
}