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

	async start (input: { id: string, userId: string, totalTimeInSec: number }) {
		return await this.repository.start(input.id, input.userId, input.totalTimeInSec)
	}

	async join (data: { id: string, userId: string, join: boolean }) {
		return await this.repository.join(data.id, data.userId, data.join)
	}

	async end (input: { id: string, userId: string }) {
		return await this.repository.end(input.id, input.userId)
	}
}