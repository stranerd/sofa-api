import { BaseMapper } from 'equipped'
import { QuizEntity } from '../../domain/entities/quizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'

export class QuizMapper extends BaseMapper<QuizFromModel, QuizToModel, QuizEntity> {
	mapFrom (model: QuizFromModel | null) {
		if (!model) return null
		const { _id, title, description, photo, isPublic, questions, user, tagId, status, createdAt, updatedAt } = model
		return new QuizEntity({
			id: _id.toString(), title, description, photo, isPublic,
			questions, user, tagId, status, createdAt, updatedAt
		})
	}

	mapTo (entity: QuizEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			isPublic: entity.isPublic,
			user: entity.user,
			tagId: entity.tagId,
			status: entity.status
		}
	}
}