import type { QueryParams } from 'equipped'

import type { VerificationToModel } from '../../data/models/verifications'
import type { IVerificationRepository } from '../irepositories/verifications'
import type { AcceptVerificationInput } from '../types'

export class VerificationsUseCase {
	repository: IVerificationRepository

	constructor(repo: IVerificationRepository) {
		this.repository = repo
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async create(input: VerificationToModel) {
		return await this.repository.create(input)
	}

	async accept(data: { id: string; data: AcceptVerificationInput }) {
		return await this.repository.accept(data)
	}
}
