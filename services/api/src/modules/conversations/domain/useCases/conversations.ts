import { QueryParams } from 'equipped'
import { ConversationToModel } from '../../data/models/conversations'
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
}