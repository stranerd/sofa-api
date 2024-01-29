import { canAccessConversation, MessagesUseCases } from '@modules/conversations'
import { UploaderUseCases } from '@modules/storage'
import { NotAuthorizedError, QueryParams, Request, Schema, validate, ValidationError } from 'equipped'

export class MessageController {
	static async find(req: Request) {
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
		const message = await MessagesUseCases.find(req.params.id)
		if (!message || message.conversationId !== req.params!.conversationId) return null
		return message
	}

	static async get(req: Request) {
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
		const query = req.query as QueryParams
		query.auth = [{ field: 'conversationId', value: req.params.conversationId }]
		return await MessagesUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				body: Schema.string(),
				media: Schema.file().nullable(),
			},
			{ ...req.body, media: req.files.media?.at(0) ?? null },
		)

		const conversation = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!conversation) throw new NotAuthorizedError()
		if (!conversation.tutor) data.media = null
		if (!data.media && data.body.length === 0) throw new ValidationError([{ field: 'body', messages: ['cannot be empty'] }])

		const media = data.media ? await UploaderUseCases.upload(`conversations/${conversation.id}/messages`, data.media) : null

		return await MessagesUseCases.add({
			...data,
			media,
			starred: false,
			conversationId: conversation.id,
			userId: req.authUser!.id,
			tags: conversation.tags(req.authUser!.id),
		})
	}

	static async star(req: Request) {
		const { starred } = validate(
			{
				starred: Schema.boolean(),
			},
			req.body,
		)

		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError()

		const updated = await MessagesUseCases.star({
			id: req.params.id,
			userId: req.authUser!.id,
			conversationId: req.params.conversationId,
			starred,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async markRead(req: Request) {
		const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError()

		return await MessagesUseCases.markRead({
			userId: req.authUser!.id,
			conversationId: req.params.conversationId,
		})
	}
}
