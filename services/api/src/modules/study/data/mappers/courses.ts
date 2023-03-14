import { BaseMapper } from 'equipped'
import { CourseEntity } from '../../domain/entities/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseMapper extends BaseMapper<CourseFromModel, CourseToModel, CourseEntity> {
	mapFrom (model: CourseFromModel | null) {
		if (!model) return null
		const { _id, title, description, photo, isPublic, user, tagId, status, price, createdAt, updatedAt } = model
		return new CourseEntity({
			id: _id.toString(), title, description, photo, isPublic,
			user, tagId, status, price, createdAt, updatedAt
		})
	}

	mapTo (entity: CourseEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			isPublic: entity.isPublic,
			user: entity.user,
			tagId: entity.tagId,
			status: entity.status,
			price: entity.price
		}
	}
}