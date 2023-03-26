import { QueryParams } from 'equipped'
import { VerificationToModel } from '../../data/models/verifications'
import { IVerificationRepository } from '../irepositories/verifications'

export class VerificationsUseCase {
	repository: IVerificationRepository

	constructor (repo: IVerificationRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async create (input: VerificationToModel) {
		return await this.repository.create(input)
	}

	async accept (data: { id: string, accept: boolean }) {
		return await this.repository.accept(data)
	}
}