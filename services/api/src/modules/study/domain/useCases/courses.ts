import type { QueryParams } from 'equipped'

import type { CourseToModel } from '../../data/models/courses'
import type { ICourseRepository } from '../irepositories/courses'
import type { Coursable, CourseMeta, CourseSections, EmbeddedUser } from '../types'

export class CoursesUseCase {
	private repository: ICourseRepository

	constructor(repository: ICourseRepository) {
		this.repository = repository
	}

	async add(data: CourseToModel) {
		return await this.repository.add(data)
	}

	async delete(input: { id: string; userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { id: string; userId: string; data: Partial<CourseToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async publish(input: { id: string; userId: string }) {
		return await this.repository.publish(input.id, input.userId)
	}

	async freeze(input: { id: string; userId: string }) {
		return await this.repository.freeze(input.id, input.userId)
	}

	async move(input: { id: string; add: boolean; data: { id: string; type: Coursable }[] }) {
		return await this.repository.move(input.id, input.data, input.add)
	}

	async updateSections(input: { id: string; userId: string; sections: CourseSections }) {
		return await this.repository.updateSections(input.id, input.userId, input.sections)
	}

	async updateMeta(data: { id: string; property: CourseMeta; value: 1 | -1 }) {
		return this.repository.updateMeta(data.id, data.property, data.value)
	}

	async updateRatings(input: { id: string; ratings: number; add: boolean }) {
		return await this.repository.updateRatings(input.id, input.ratings, input.add)
	}
}
