import { isAuthenticated } from '@application/middlewares'
import { ConversationEntity, ConversationsUseCases, MessagesUseCases } from '@modules/conversations'
import { UsersUseCases } from '@modules/users'
import { AI } from '@utils/ai'
import { ApiDef, BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/conversations', groups: ['Conversations'], middlewares: [isAuthenticated] })

router.get<ConversationsGetRouteDef>({ path: '/', key: 'conversations-conversations-get' })(async (req) => {
	const query = req.query
	query.authType = QueryKeys.or
	query.auth = [
		{ field: 'user.id', value: req.authUser!.id },
		{ field: 'tutor.id', value: req.authUser!.id },
	]
	return await ConversationsUseCases.get(query)
})

router.get<ConversationsFindRouteDef>({ path: '/:id', key: 'conversations-conversations-find' })(async (req) => {
	const conversation = await ConversationsUseCases.find(req.params.id)
	if (!conversation) return null
	if (![conversation.user.id, conversation.tutor?.id ?? ''].includes(req.authUser!.id)) return null
	return conversation
})

router.post<ConversationsCreateRouteDef>({ path: '/', key: 'conversations-conversations-create' })(async (req) => {
	const { body, tutorId } = validate(
		{
			body: Schema.string().min(1),
			tutorId: Schema.string().min(1).nullable(),
		},
		req.body,
	)

	const authUserId = req.authUser!.id
	const user = await UsersUseCases.find(authUserId)
	if (!user || user.isDeleted()) throw new BadRequestError('user not found')

	const tutor = tutorId ? await UsersUseCases.find(tutorId) : null
	if (tutorId) {
		if (!tutor || tutor.isDeleted()) throw new BadRequestError('tutor not found')
		if (!tutor.canJoinConversations()) throw new BadRequestError("tutor can't join conversations right now")
	}

	const title = await AI.summarizeForTitle(body)
	const conversation = await ConversationsUseCases.add({
		title,
		user: user.getEmbedded(),
		pending: !!tutorId,
		accepted: !tutorId ? { is: true, at: Date.now() } : null,
		tutor: tutor?.getEmbedded() ?? null,
	})
	await MessagesUseCases.add({
		body,
		media: null,
		starred: false,
		conversationId: conversation.id,
		userId: conversation.user.id,
		tags: conversation.tags(conversation.user.id),
	})

	return conversation
})

router.put<ConversationsUpdateRouteDef>({ path: '/:id', key: 'conversations-conversations-update' })(async (req) => {
	const data = validate(
		{
			title: Schema.string().min(1),
		},
		req.body,
	)

	const updated = await ConversationsUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data,
	})
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.delete<ConversationsDeleteRouteDef>({ path: '/:id', key: 'conversations-conversations-delete' })(async (req) => {
	const isDeleted = await ConversationsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
	if (isDeleted) return isDeleted
	throw new NotAuthorizedError()
})

router.post<ConversationsAcceptRouteDef>({ path: '/:id/accept', key: 'conversations-conversations-accept' })(async (req) => {
	const { accept } = validate({ accept: Schema.boolean() }, req.body)
	const isUpdated = await ConversationsUseCases.accept({ id: req.params.id, accept, tutorId: req.authUser!.id })
	if (isUpdated) return isUpdated
	throw new NotAuthorizedError()
})

router.post<ConversationsEndRouteDef>({ path: '/:id/end', key: 'conversations-conversations-end' })(async (req) => {
	const data = validate(
		{
			rating: Schema.number().round(0).gte(0).lte(5),
			message: Schema.string(),
		},
		req.body,
	)

	const updatedConversation = await ConversationsUseCases.end({
		...data,
		conversationId: req.params.id,
		userId: req.authUser!.id,
	})

	if (updatedConversation) return updatedConversation
	throw new NotAuthorizedError()
})

export default router

type ConversationsGetRouteDef = ApiDef<{
	key: 'conversations-conversations-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ConversationEntity>
}>

type ConversationsFindRouteDef = ApiDef<{
	key: 'conversations-conversations-find'
	method: 'get'
	params: { id: string }
	response: ConversationEntity | null
}>

type ConversationsCreateRouteDef = ApiDef<{
	key: 'conversations-conversations-create'
	method: 'post'
	body: { body: string; tutorId: string | null }
	response: ConversationEntity
}>

type ConversationsUpdateRouteDef = ApiDef<{
	key: 'conversations-conversations-update'
	method: 'put'
	params: { id: string }
	body: { title: string }
	response: ConversationEntity
}>

type ConversationsDeleteRouteDef = ApiDef<{
	key: 'conversations-conversations-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>

type ConversationsAcceptRouteDef = ApiDef<{
	key: 'conversations-conversations-accept'
	method: 'post'
	params: { id: string }
	body: { accept: boolean }
	response: ConversationEntity
}>

type ConversationsEndRouteDef = ApiDef<{
	key: 'conversations-conversations-end'
	method: 'post'
	params: { id: string }
	body: { rating: number; message: string }
	response: ConversationEntity
}>
