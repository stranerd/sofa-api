import { Conditions, QueryKeys } from 'equipped'

import { AI } from '@utils/ai'

import { MessagesUseCases } from '..'
import { ConversationEntity } from '../domain/entities/conversations'
import type { MessageEntity } from '../domain/entities/messages'

export const generateResponse = async (message: MessageEntity) => {
	if (!message.tags.includes(ConversationEntity.AI_Id)) return

	const { results: messages } = await MessagesUseCases.get({
		where: [
			{ field: 'conversationId', value: message.conversationId },
			{ field: 'createdAt', value: message.createdAt, condition: Conditions.lt },
			{
				condition: QueryKeys.or,
				value: [
					{ field: 'userId', value: ConversationEntity.AI_Id },
					{ field: 'tags', condition: Conditions.in, value: ConversationEntity.AI_Id },
				],
			},
		],
		sort: [{ field: 'createdAt', desc: true }],
		limit: 10,
	})

	const aiMessages: Parameters<typeof AI.replyMessage>[0] = messages
		.map((m) => ({ role: m.userId === ConversationEntity.AI_Id ? ('assistant' as const) : ('user' as const), content: m.body }))
		.reverse()
		.concat({ role: 'user', content: message.body })

	const response = await AI.replyMessage(aiMessages).catch(() => null)
	if (!response) return

	await MessagesUseCases.add({
		body: response,
		media: null,
		tags: [message.userId],
		conversationId: message.conversationId,
		userId: ConversationEntity.AI_Id,
		starred: false,
	})
}
