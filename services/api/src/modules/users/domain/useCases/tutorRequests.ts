import { QueryParams } from 'equipped'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { ITutorRequestRepository } from '../irepositories/tutorRequests'
import { AcceptVerificationInput } from '../types'

export class TutorRequestsUseCase {
	repository: ITutorRequestRepository

	constructor(repo: ITutorRequestRepository) {
		this.repository = repo
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async create(input: TutorRequestToModel) {
		return await this.repository.create(input)
	}

	async accept(data: { id: string; data: AcceptVerificationInput }) {
		return await this.repository.accept(data)
	}

	async markTestFinished(testId: string) {
		return await this.repository.markTestFinished(testId)
	}
}
