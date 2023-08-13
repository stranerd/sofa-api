import { QueryParams } from 'equipped'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { ITutorRequestRepository } from '../irepositories/tutorRequests'
import { EmbeddedUser } from '../types'

export class TutorRequestsUseCase {
	repository: ITutorRequestRepository

	constructor (repo: ITutorRequestRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async create (input: TutorRequestToModel) {
		return await this.repository.create(input)
	}

	async accept (data: { id: string, tutorId: string, accept: boolean }) {
		return await this.repository.accept(data)
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}
}