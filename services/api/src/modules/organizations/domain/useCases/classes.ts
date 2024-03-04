import { QueryParams } from 'equipped'
import { ClassToModel } from '../../data/models/classes'
import { IClassRepository } from '../irepositories/classes'
import { ClassLesson, ClassMembers, EmbeddedUser, LessonMembers } from '../types'

export class ClassesUseCase {
	private repository: IClassRepository

	constructor(repository: IClassRepository) {
		this.repository = repository
	}

	async add(data: ClassToModel) {
		return await this.repository.add(data)
	}

	async delete(data: { id: string; organizationId: string }) {
		return await this.repository.delete(data.organizationId, data.id)
	}

	async find(classId: string) {
		return await this.repository.find(classId)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { id: string; organizationId: string; data: Partial<ClassToModel> }) {
		return await this.repository.update(input.organizationId, input.id, input.data)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async addLesson(data: { organizationId: string; classId: string; data: Omit<ClassLesson, 'id'> }) {
		return await this.repository.addLesson(data.organizationId, data.classId, data.data)
	}

	async deleteLesson(data: { organizationId: string; classId: string; lessonId: string }) {
		return await this.repository.deleteLesson(data.organizationId, data.classId, data.lessonId)
	}

	async updateLesson(input: { organizationId: string; classId: string; lessonId: string; data: Partial<ClassLesson> }) {
		return await this.repository.updateLesson(input.organizationId, input.classId, input.lessonId, input.data)
	}

	async manageMembers(data: { organizationId: string; classId: string; userIds: string[]; type: keyof ClassMembers; add: boolean }) {
		return await this.repository.manageMembers(data)
	}

	async manageLessonUsers(input: {
		organizationId: string
		classId: string
		lessonId: string
		userIds: string[]
		type: keyof LessonMembers
		add: boolean
	}) {
		return await this.repository.manageLessonUsers(input)
	}

	async updateLessonCurriculum(data: {
		organizationId: string
		classId: string
		lessonId: string
		curriculum: ClassLesson['curriculum']
	}) {
		return await this.repository.updateLessonCurriculum(data)
	}
}
