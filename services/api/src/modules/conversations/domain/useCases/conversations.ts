import { QueryParams } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
import { MessageFromModel } from '../../data/models/messages'
import { ReviewToModel } from '../../data/models/reviews'
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

	async addTutor (input: { id: string, userId: string, tutor: EmbeddedUser }) {
		return await this.repository.addTutor(input.id, input.userId, input.tutor)
	}

	async removeTutor (data: Omit<ReviewToModel, 'to'>) {
		return await this.repository.removeTutor(data)
	}

	async updateLastMessage (message: MessageFromModel) {
		return await this.repository.updateLastMessage(message)
	}
}