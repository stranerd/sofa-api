import { QueryParams } from 'equipped'
import { PlayToModel } from '../../data/models/plays'
import { IPlayRepository } from '../irepositories/plays'
import { EmbeddedUser, PlayScore } from '../types'

export class PlaysUseCase {
	protected repository: IPlayRepository

	constructor(repository: IPlayRepository) {
		this.repository = repository
	}

	async add(data: PlayToModel) {
		return await this.repository.add(data)
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

	async start(input: { id: string; userId: string }) {
		return await this.repository.start(input.id, input.userId)
	}

	async end(input: { id: string; userId: string }) {
		return await this.repository.end(input.id, input.userId)
	}

	async score(data: { id: string; userId: string; scores: PlayScore }) {
		return await this.repository.score(data.id, data.userId, data.scores)
	}

	async join(data: { id: string; userId: string; join: boolean }) {
		return await this.repository.join(data.id, data.userId, data.join)
	}
}
