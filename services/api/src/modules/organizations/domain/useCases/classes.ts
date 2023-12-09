import { QueryParams } from 'equipped'
import { ClassToModel } from '../../data/models/classes'
import { IClassRepository } from '../irepositories/classes'
import { EmbeddedUser } from '../types'

export class ClassesUseCase {
	private repository: IClassRepository

	constructor (repository: IClassRepository) {
		this.repository = repository
	}

	async add (data: ClassToModel) {
		return await this.repository.add(data)
	}

	async delete (data: { id: string, organizationId: string }) {
		return await this.repository.delete(data.organizationId, data.id)
	}

	async find (classId: string) {
		return await this.repository.find(classId)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, organizationId: string, data: Partial<ClassToModel> }) {
		return await this.repository.update(input.organizationId, input.id, input.data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}
}
