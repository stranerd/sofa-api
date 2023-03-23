import { ConversationsUseCases, MessagesUseCases } from '@modules/conversations'
import { WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { AI } from '@utils/ai'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class ConversationController {
	static async find (req: Request) {
		const conversation = await ConversationsUseCases.find(req.params.id)
		if (!conversation || conversation.user.id !== req.authUser!.id) return null
		return conversation
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'user.id', value: req.authUser!.id }]
		return await ConversationsUseCases.get(query)
	}

	static async create (req: Request) {
		const { body } = validate({
			body: Schema.string().min(1),
		}, req.body)

		const authUserId = req.authUser!.id
		const user = await UsersUseCases.find(authUserId)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const title = await AI.summarizeForTitle(body)
		const conversation = await ConversationsUseCases.add({ title, user: user.getEmbedded() })
		await MessagesUseCases.add({
			body, media: null, starred: false,
			conversationId: conversation.id,
			userId: conversation.user.id,
			tags: conversation.tags(conversation.user.id)
		})

		return conversation
	}

	static async delete (req: Request) {
		const isDeleted = await ConversationsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async addTutor (req: Request) {
		const { tutorId } = validate({
			tutorId: Schema.string().min(1)
		}, req.body)

		const tutor = await UsersUseCases.find(tutorId)
		if (!tutor || tutor.isDeleted()) throw new BadRequestError('tutor not found')
		if (!tutor.canJoinConversations()) throw new BadRequestError('tutor can\'t join conversations right now')

		const wallet = await WalletsUseCases.get(req.authUser!.id)
		if (!wallet.canAddTutorToConversation())
			throw new BadRequestError('you can\'t add a tutor to your conversations')

		const updatedConversation = await ConversationsUseCases.setTutor({
			id: req.params.id,
			userId: req.authUser!.id,
			tutor: tutor.getEmbedded()
		})

		if (updatedConversation) return updatedConversation
		throw new NotAuthorizedError()
	}

	static async removeTutor (req: Request) {
		const updatedConversation = await ConversationsUseCases.setTutor({
			id: req.params.id,
			userId: req.authUser!.id,
			tutor: null
		})

		if (updatedConversation) return updatedConversation
		throw new NotAuthorizedError()
	}
}