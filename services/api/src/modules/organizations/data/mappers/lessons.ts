import { BaseMapper } from 'equipped'
import { LessonEntity } from '../../domain/entities/lessons'
import { LessonFromModel, LessonToModel } from '../models/lessons'

export class LessonMapper extends BaseMapper<LessonFromModel, LessonToModel, LessonEntity> {
	mapFrom (model: LessonFromModel | null) {
		if (!model) return null
		const { _id, organizationId, classId, title, users, createdAt, updatedAt } = model
		return new LessonEntity({
			id: _id.toString(), organizationId, classId, title, users, createdAt, updatedAt
		})
	}

	mapTo (entity: LessonEntity) {
		return {
			title: entity.title,
			classId: entity.classId,
			organizationId: entity.organizationId,
			users: entity.users,
		}
	}
}
