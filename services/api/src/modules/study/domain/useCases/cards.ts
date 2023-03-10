import { QueryParams } from 'equipped'
import { CardToModel } from '../../data/models/cards'
import { ICardRepository } from '../irepositories/cards'
import { EmbeddedUser } from '../types'

export class CardsUseCase {
	private repository: ICardRepository

	constructor (repository: ICardRepository) {
		this.repository = repository
	}

	async add (data: CardToModel) {
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

	async update (input: { id: string, userId: string, data: Partial<CardToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async saveMatch (input: { cardId: string, userId: string, time: number }) {
		return await this.repository.saveMatch(input.cardId, input.userId, input.time)
	}
}