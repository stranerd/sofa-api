import { QueryParams } from 'equipped'
import { InstitutionToModel } from '../../data/models/institutions'
import { IInstitutionRepository } from '../irepositories/institutions'

export class InstitutionsUseCase {
	private repository: IInstitutionRepository

	constructor(repository: IInstitutionRepository) {
		this.repository = repository
	}

	async add(data: InstitutionToModel) {
		return await this.repository.add(data)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { id: string; data: Partial<InstitutionToModel> }) {
		return await this.repository.update(input.id, input.data)
	}
}
