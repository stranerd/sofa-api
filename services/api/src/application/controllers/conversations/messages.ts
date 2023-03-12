import { canAccessConversation, ConversationsUseCases, MessagesUseCases } from '@modules/conversations'
import { UploaderUseCases } from '@modules/storage'
import { NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class MessageController {
	static async find (req: Request) {
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
		const message = await MessagesUseCases.find(req.params.id)
		if (!message || message.conversationId !== req.params!.conversationId) return null
		return message
	}

	static async get (req: Request) {
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
		const query = req.query as QueryParams
		query.auth = [{ field: 'conversationId', value: req.params.conversationId }]
		return await MessagesUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validateReq({
			body: Schema.string().min(1),
			media: Schema.file().nullable(),
		}, { ...req.body, media: req.files.media?.[0] ?? null })

		const conversation = await ConversationsUseCases.find(req.params.conversationId)
		if (!conversation) throw new NotAuthorizedError()
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id, conversation)
		if (!conversation || !hasAccess) throw new NotAuthorizedError('cannot send a messages to this conversation')

		const media = data.media ? await UploaderUseCases.upload(`conversations/${conversation.id}/messages`, data.media) : null

		return await MessagesUseCases.add({
			...data, media, starred: false,
			conversationId: conversation.id, userId: req.authUser!.id, tags: conversation.tags()
		})
	}

	static async star (req: Request) {
		const { starred } = validateReq({
			starred: Schema.boolean(),
		}, req.body)
		const updated = await MessagesUseCases.star({
			id: req.params.id, userId: req.authUser!.id, conversationId: req.params.conversationId, starred
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}