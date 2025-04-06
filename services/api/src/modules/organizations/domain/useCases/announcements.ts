import type { QueryParams } from 'equipped'

import type { AnnouncementToModel } from '../../data/models/announcements'
import type { IAnnouncementRepository } from '../irepositories/announcements'
import type { EmbeddedUser } from '../types'

export class AnnouncementsUseCase {
	private repository: IAnnouncementRepository

	constructor(repository: IAnnouncementRepository) {
		this.repository = repository
	}

	async add(data: AnnouncementToModel) {
		return await this.repository.add(data)
	}

	async deleteClassAnnouncements(data: { organizationId: string; classId: string }) {
		return await this.repository.deleteClassAnnouncements(data.organizationId, data.classId)
	}

	async delete(data: { organizationId: string; classId: string; id: string }) {
		return await this.repository.delete(data.organizationId, data.classId, data.id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { organizationId: string; classId: string; id: string; data: Partial<AnnouncementToModel> }) {
		return await this.repository.update(input.organizationId, input.classId, input.id, input.data)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async markRead(input: { organizationId: string; classId: string; userId: string }) {
		return await this.repository.markRead(input.organizationId, input.classId, input.userId)
	}
}
