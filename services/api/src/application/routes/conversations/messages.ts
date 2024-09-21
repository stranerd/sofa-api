import { isAuthenticated } from '@application/middlewares'
import { canAccessConversation, MessageEntity, MessagesUseCases } from '@modules/conversations'
import { UploaderUseCases } from '@modules/storage'
import { ApiDef, FileSchema, NotAuthorizedError, QueryParams, QueryResults, Router, Schema, validate, ValidationError } from 'equipped'

const router = new Router({ path: '/conversations/:conversationId/messages', groups: ['Messages'], middlewares: [isAuthenticated] })

router.get<MessagesGetRouteDef>({ path: '/', key: 'conversations-messages-get' })(async (req) => {
	const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
	if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
	const query = req.query
	query.auth = [{ field: 'conversationId', value: req.params.conversationId }]
	return await MessagesUseCases.get(query)
})

router.get<MessagesFindRouteDef>({ path: '/:id', key: 'conversations-messages-find' })(async (req) => {
	const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
	if (!hasAccess) throw new NotAuthorizedError('cannot access the messages for this conversation')
	const message = await MessagesUseCases.find(req.params.id)
	if (!message || message.conversationId !== req.params!.conversationId) return null
	return message
})

router.post<MessagesCreateRouteDef>({ path: '/', key: 'conversations-messages-create' })(async (req) => {
	const data = validate(
		{
			body: Schema.string(),
			media: Schema.file().nullable(),
		},
		{ ...req.body, media: req.body.media?.at?.(0) ?? null },
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
})

router.post<MessagesStarRouteDef>({ path: '/:id/star', key: 'conversations-messages-star' })(async (req) => {
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
})

router.put<MessagesMarkReadRouteDef>({ path: '/read', key: 'conversations-messages-mark-read' })(async (req) => {
	const hasAccess = await canAccessConversation(req.params.conversationId, req.authUser!.id)
	if (!hasAccess) throw new NotAuthorizedError()

	return await MessagesUseCases.markRead({
		userId: req.authUser!.id,
		conversationId: req.params.conversationId,
	})
})

export default router

type MessagesGetRouteDef = ApiDef<{
	key: 'conversations-messages-get'
	method: 'get'
	params: { conversationId: string }
	query: QueryParams
	response: QueryResults<MessageEntity>
}>

type MessagesFindRouteDef = ApiDef<{
	key: 'conversations-messages-find'
	method: 'get'
	params: { conversationId: string; id: string }
	response: MessageEntity | null
}>

type MessagesCreateRouteDef = ApiDef<{
	key: 'conversations-messages-create'
	method: 'post'
	params: { conversationId: string }
	body: { body: string; media: FileSchema | null }
	response: MessageEntity
}>

type MessagesStarRouteDef = ApiDef<{
	key: 'conversations-messages-star'
	method: 'post'
	params: { conversationId: string; id: string }
	body: { starred: boolean }
	response: MessageEntity
}>

type MessagesMarkReadRouteDef = ApiDef<{
	key: 'conversations-messages-mark-read'
	method: 'put'
	params: { conversationId: string }
	response: boolean
}>
