import { BaseMapper } from 'equipped'
import { CourseEntity } from '../../domain/entities/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseMapper extends BaseMapper<CourseFromModel, CourseToModel, CourseEntity> {
	mapFrom(model: CourseFromModel | null) {
		if (!model) return null
		const { _id, ...rest } = model
		return new CourseEntity({
			id: _id.toString(),
			...rest,
		})
	}

	mapTo(entity: CourseEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			user: entity.user,
			topicId: entity.topicId,
			tagIds: entity.tagIds,
			status: entity.status,
			frozen: entity.frozen,
			price: entity.price,
		}
	}
}
