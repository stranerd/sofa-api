import { BaseMapper } from 'equipped'
import { QuestionEntity } from '../../domain/entities/questions'
import { QuestionFromModel, QuestionToModel } from '../models/questions'

export class QuestionMapper extends BaseMapper<QuestionFromModel, QuestionToModel, QuestionEntity> {
	mapFrom(model: QuestionFromModel | null) {
		if (!model) return null
		const { _id, userId, quizId, question, explanation, questionMedia, timeLimit, data, createdAt, updatedAt } = model
		return new QuestionEntity({
			id: _id.toString(),
			userId,
			quizId,
			question,
			explanation,
			questionMedia,
			timeLimit,
			data,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: QuestionEntity) {
		return {
			userId: entity.userId,
			quizId: entity.quizId,
			question: entity.question,
			explanation: entity.explanation,
			questionMedia: entity.questionMedia,
			timeLimit: entity.timeLimit,
			data: entity.data,
		}
	}
}
