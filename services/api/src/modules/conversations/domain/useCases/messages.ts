import { QueryParams } from 'equipped'
import { MessageToModel } from '../../data/models/messages'
import { IMessageRepository } from '../irepositories/messages'

export class MessagesUseCase {
	private repository: IMessageRepository

	constructor (repository: IMessageRepository) {
		this.repository = repository
	}

	async add (data: MessageToModel) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async star (input: { conversationId: string, id: string, userId: string, starred: boolean }) {
		return await this.repository.star(input.conversationId, input.id, input.userId, input.starred)
	}

	async deleteConversationMessages (conversationId: string) {
		return await this.repository.deleteConversationMessages(conversationId)
	}
}