import type { QueryParams } from 'equipped'

import type { ConversationToModel } from '../../data/models/conversations'
import type { MessageFromModel } from '../../data/models/messages'
import type { IConversationRepository } from '../irepositories/conversations'
import type { EmbeddedUser } from '../types'

export class ConversationsUseCase {
	private repository: IConversationRepository

	constructor(repository: IConversationRepository) {
		this.repository = repository
	}

	async add(data: ConversationToModel) {
		return await this.repository.add(data)
	}

	async update(input: { id: string; userId: string; data: Partial<ConversationToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async delete(input: { id: string; userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async accept(data: { id: string; tutorId: string; accept: boolean }) {
		return await this.repository.accept(data)
	}

	async end(data: { conversationId: string; userId: string; rating: number; message: string }) {
		return await this.repository.end(data)
	}

	async updateLastMessage(message: MessageFromModel) {
		return await this.repository.updateLastMessage(message)
	}
}
