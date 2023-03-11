import { BaseMapper } from 'equipped'
import { QuizEntity } from '../../domain/entities/quizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'

export class QuizMapper extends BaseMapper<QuizFromModel, QuizToModel, QuizEntity> {
	mapFrom (model: QuizFromModel | null) {
		if (!model) return null
		const { _id, title, questions, user, tagId, status, price, createdAt, updatedAt } = model
		return new QuizEntity({
			id: _id.toString(), title, questions, user, tagId, status, price, createdAt, updatedAt
		})
	}

	mapTo (entity: QuizEntity) {
		return {
			title: entity.title,
			user: entity.user,
			tagId: entity.tagId,
			status: entity.status,
			price: entity.price
		}
	}
}