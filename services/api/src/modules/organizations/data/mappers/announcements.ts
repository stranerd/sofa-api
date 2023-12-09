import { BaseMapper } from 'equipped'
import { AnnouncementEntity } from '../../domain/entities/announcements'
import { AnnouncementFromModel, AnnouncementToModel } from '../models/announcements'

export class AnnouncementMapper extends BaseMapper<AnnouncementFromModel, AnnouncementToModel, AnnouncementEntity> {
	mapFrom (model: AnnouncementFromModel | null) {
		if (!model) return null
		const { _id, organizationId, classId, filter, user, body, readAt, createdAt, updatedAt } = model
		return new AnnouncementEntity({
			id: _id.toString(), organizationId, classId, filter, user,
			body, readAt, createdAt, updatedAt
		})
	}

	mapTo (entity: AnnouncementEntity) {
		return {
			body: entity.body,
			classId: entity.classId,
			organizationId: entity.organizationId,
			filter: entity.filter,
			user: entity.user
		}
	}
}
