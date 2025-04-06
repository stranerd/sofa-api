import { BaseMapper } from 'equipped'

import { QuestionEntity } from '../../domain/entities/questions'
import type { QuestionFromModel, QuestionToModel } from '../models/questions'

export class QuestionMapper extends BaseMapper<QuestionFromModel, QuestionToModel, QuestionEntity> {
	mapFrom(model: QuestionFromModel | null) {
		if (!model) return null
		return !model
			? null
			: new QuestionEntity({
					id: model._id.toString(),
					userId: model.userId,
					quizId: model.quizId,
					question: model.question,
					explanation: model.explanation,
					questionMedia: model.questionMedia,
					timeLimit: model.timeLimit,
					data: model.data,
					isAiGenerated: model.isAiGenerated,
					createdAt: model.createdAt,
					updatedAt: model.updatedAt,
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
			isAiGenerated: entity.isAiGenerated,
		}
	}
}
