import { BaseMapper } from 'equipped'
import { CourseEntity } from '../../domain/entities/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseMapper extends BaseMapper<CourseFromModel, CourseToModel, CourseEntity> {
	mapFrom(model: CourseFromModel | null) {
		if (!model) return null
		return !model
			? null
			: new CourseEntity({
					id: model._id.toString(),
					coursables: model.coursables,
					sections: model.sections,
					title: model.title,
					description: model.description,
					photo: model.photo,
					ratings: model.ratings,
					user: model.user,
					topicId: model.topicId,
					tagIds: model.tagIds,
					status: model.status,
					frozen: model.frozen,
					price: model.price,
					meta: model.meta,
					createdAt: model.createdAt,
					updatedAt: model.updatedAt,
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
