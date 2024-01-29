import { QueryParams } from 'equipped'
import { ConnectToModel } from '../../data/models/connects'
import { IConnectRepository } from '../irepositories/connects'
import { EmbeddedUser } from '../types'

export class ConnectsUseCase {
	repository: IConnectRepository

	constructor(repo: IConnectRepository) {
		this.repository = repo
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async create(input: ConnectToModel) {
		return await this.repository.create(input)
	}

	async accept(data: { id: string; userId: string; accept: boolean }) {
		return await this.repository.accept(data)
	}

	async delete(data: { id: string; userId: string }) {
		return await this.repository.delete(data)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}
}
