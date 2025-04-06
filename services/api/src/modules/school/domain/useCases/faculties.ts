import type { QueryParams } from 'equipped'

import type { FacultyToModel } from '../../data/models/faculties'
import type { IFacultyRepository } from '../irepositories/faculties'

export class FacultiesUseCase {
	private repository: IFacultyRepository

	constructor(repository: IFacultyRepository) {
		this.repository = repository
	}

	async add(data: FacultyToModel) {
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

	async update(input: { id: string; data: Partial<FacultyToModel> }) {
		return await this.repository.update(input.id, input.data)
	}

	async deleteInstitutionFaculties(institutionId: string) {
		return await this.repository.deleteInstitutionFaculties(institutionId)
	}
}
