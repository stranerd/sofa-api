import { BaseMapper } from 'equipped'
import { QuizEntity } from '../../domain/entities/quizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'

export class QuizMapper extends BaseMapper<QuizFromModel, QuizToModel, QuizEntity> {
	mapFrom(model: QuizFromModel | null) {
		if (!model) return null
		return !model
			? null
			: new QuizEntity({
					id: model._id.toString(),
					title: model.title,
					description: model.description,
					photo: model.photo,
					courseIds: model.courseIds,
					user: model.user,
					topicId: model.topicId,
					tagIds: model.tagIds,
					status: model.status,
					isForTutors: model.isForTutors,
					modes: model.modes,
					ratings: model.ratings,
					questions: model.questions.map((q) => (typeof q === 'string' ? { label: '', items: [q] } : q)),
					access: model.access,
					meta: model.meta,
					timeLimit: model.timeLimit,
					createdAt: model.createdAt,
					updatedAt: model.updatedAt,
				})
	}

	mapTo(entity: QuizEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			user: entity.user,
			topicId: entity.topicId,
			tagIds: entity.tagIds,
			status: entity.status,
			isForTutors: entity.isForTutors,
			modes: entity.modes,
			timeLimit: entity.timeLimit,
		}
	}
}
