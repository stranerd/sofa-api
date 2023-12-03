import { BaseMapper } from 'equipped'
import { QuizEntity } from '../../domain/entities/quizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'

export class QuizMapper extends BaseMapper<QuizFromModel, QuizToModel, QuizEntity> {
	mapFrom (model: QuizFromModel | null) {
		if (!model) return null
		const {
			_id, title, description, photo, questions, courseId, user, topicId, tagIds,
			access, ratings, status, meta, isForTutors, createdAt, updatedAt
		} = model
		return new QuizEntity({
			id: _id.toString(), title, description, photo, questions, courseId, ratings,
			access, user, topicId, tagIds, status, meta, isForTutors, createdAt, updatedAt
		})
	}

	mapTo (entity: QuizEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			courseId: entity.courseId,
			user: entity.user,
			topicId: entity.topicId,
			tagIds: entity.tagIds,
			status: entity.status,
			isForTutors: entity.isForTutors
		}
	}
}