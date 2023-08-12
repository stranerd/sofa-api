import { QueryParams } from 'equipped'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { ITutorRequestRepository } from '../irepositories/tutorRequests'

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

	async accept (data: { id: string, accept: boolean }) {
		return await this.repository.accept(data)
	}

	async markTestFinished (testId: string) {
		return await this.repository.markTestFinished(testId)
	}
}