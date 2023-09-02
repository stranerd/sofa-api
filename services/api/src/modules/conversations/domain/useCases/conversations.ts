import { QueryParams } from 'equipped'
import { InteractionEntities, ReviewsUseCases } from '@modules/interactions'
import { ConversationToModel } from '../../data/models/conversations'
import { MessageFromModel } from '../../data/models/messages'
import { IConversationRepository } from '../irepositories/conversations'
import { EmbeddedUser } from '../types'

export class ConversationsUseCase {
	private repository: IConversationRepository

	constructor (repository: IConversationRepository) {
		this.repository = repository
	}

	async add (data: ConversationToModel) {
		return await this.repository.add(data)
	}

	async update (input: { id: string, userId: string, data: Partial<ConversationToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async delete (input: { id: string, userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async removeTutor (data: { conversationId: string, user: EmbeddedUser, rating: number, message: string }) {
		const { conversation, tutorRequest } = await this.repository.removeTutor({ conversationId: data.conversationId, userId: data.user.id })
		if (conversation && tutorRequest) await ReviewsUseCases.add({
			user: data.user, rating: data.rating, message: data.message,
			entity: { type: InteractionEntities.tutorConversations, id: tutorRequest.id, userId: tutorRequest.tutor.id }
		})
		return conversation
	}

	async updateLastMessage (message: MessageFromModel) {
		return await this.repository.updateLastMessage(message)
	}
}