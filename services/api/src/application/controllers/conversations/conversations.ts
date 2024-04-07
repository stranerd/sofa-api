import { ConversationsUseCases, MessagesUseCases } from '@modules/conversations'
import { UsersUseCases } from '@modules/users'
import { AI } from '@utils/ai'
import { BadRequestError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class ConversationController {
	static async find(req: Request) {
		const conversation = await ConversationsUseCases.find(req.params.id)
		if (!conversation) return null
		if (![conversation.user.id, conversation.tutor?.id ?? ''].includes(req.authUser!.id)) return null
		return conversation
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'user.id', value: req.authUser!.id },
			{ field: 'tutor.id', value: req.authUser!.id },
		]
		return await ConversationsUseCases.get(query)
	}

	static async create(req: Request) {
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
	}

	static async update(req: Request) {
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
	}

	static async delete(req: Request) {
		const isDeleted = await ConversationsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async accept(req: Request) {
		const { accept } = validate({ accept: Schema.boolean() }, req.body)
		const isUpdated = await ConversationsUseCases.accept({ id: req.params.id, accept, tutorId: req.authUser!.id })
		if (isUpdated) return isUpdated
		throw new NotAuthorizedError()
	}

	static async end(req: Request) {
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
	}
}
