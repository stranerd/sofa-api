import { BaseMapper } from 'equipped'
import { CourseEntity } from '../../domain/entities/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseMapper extends BaseMapper<CourseFromModel, CourseToModel, CourseEntity> {
	mapFrom (model: CourseFromModel | null) {
		if (!model) return null
		const { _id, coursables, sections, title, description, photo, user, tagId, status, frozen, price, createdAt, updatedAt } = model
		return new CourseEntity({
			id: _id.toString(), coursables, sections, title, description, photo,
			user, tagId, status, frozen, price, createdAt, updatedAt
		})
	}

	mapTo (entity: CourseEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			user: entity.user,
			tagId: entity.tagId,
			status: entity.status,
			frozen: entity.frozen,
			price: entity.price
		}
	}
}