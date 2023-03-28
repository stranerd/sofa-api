import { QueryParams } from 'equipped'
import { GameToModel } from '../../data/models/games'
import { IGameRepository } from '../irepositories/games'
import { EmbeddedUser } from '../types'

export class GamesUseCase {
	private repository: IGameRepository

	constructor (repository: IGameRepository) {
		this.repository = repository
	}

	async add (data: GameToModel) {
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