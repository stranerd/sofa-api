import { QueryParams } from 'equipped'
import { LessonToModel } from '../../data/models/lessons'
import { ILessonRepository } from '../irepositories/lessons'
import { LessonMembers } from '../types'

export class LessonsUseCase {
	private repository: ILessonRepository

	constructor (repository: ILessonRepository) {
		this.repository = repository
	}

	async add (data: LessonToModel) {
		return await this.repository.add(data)
	}

	async deleteClassLessons (data: { organizationId: string, classId: string }) {
		return await this.repository.deleteClassLessons(data.organizationId, data.classId)
	}

	async delete (data: { organizationId: string, classId: string, id: string }) {
		return await this.repository.delete(data.organizationId, data.classId, data.id)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { organizationId: string, classId: string, id: string, data: Partial<LessonToModel> }) {
		return await this.repository.update(input.organizationId, input.classId, input.id, input.data)
	}

	async manageUsers (input: {
		organizationId: string, classId: string, id: string, userIds: string[], type: keyof LessonMembers, add: boolean
	}) {
		return await this.repository.manageUsers(input)
	}
}
