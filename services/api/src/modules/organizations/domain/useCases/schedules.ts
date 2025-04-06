import type { QueryParams } from 'equipped'

import type { ScheduleToModel } from '../../data/models/schedules'
import type { IScheduleRepository } from '../irepositories/schedules'
import type { EmbeddedUser } from '../types'

export class SchedulesUseCase {
	private repository: IScheduleRepository

	constructor(repository: IScheduleRepository) {
		this.repository = repository
	}

	async add(data: ScheduleToModel) {
		return await this.repository.add(data)
	}

	async deleteLessonSchedules(data: { organizationId: string; classId: string; lessonId: string }) {
		return await this.repository.deleteLessonSchedules(data.organizationId, data.classId, data.lessonId)
	}

	async delete(data: { organizationId: string; classId: string; id: string; lessons: string[] | undefined }) {
		return await this.repository.delete(data.organizationId, data.classId, data.id, data.lessons)
	}

	async start(data: { organizationId: string; classId: string; id: string; lessons: string[] | undefined }) {
		return await this.repository.start(data.organizationId, data.classId, data.id, data.lessons)
	}

	async end(data: { organizationId: string; classId: string; id: string; lessons: string[] | undefined }) {
		return await this.repository.end(data.organizationId, data.classId, data.id, data.lessons)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: {
		organizationId: string
		classId: string
		id: string
		data: Partial<ScheduleToModel>
		lessons: string[] | undefined
	}) {
		return await this.repository.update(input.organizationId, input.classId, input.id, input.data, input.lessons)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}
}
