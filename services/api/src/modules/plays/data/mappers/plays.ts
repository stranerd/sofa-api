import { BaseMapper } from 'equipped'
import { PlayEntity } from '../../domain/entities/plays'
import { PlayFromModel, PlayToModel } from '../models/plays'

export class PlayMapper extends BaseMapper<PlayFromModel, PlayToModel, PlayEntity> {
	mapFrom(model: PlayFromModel | null) {
		if (!model) return null
		const { _id, quizId, status, user, data, questions, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt } = model
		return new PlayEntity({
			id: _id.toString(),
			quizId,
			status,
			user,
			data,
			questions,
			totalTimeInSec,
			scores,
			startedAt,
			endedAt,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: PlayEntity) {
		return {
			quizId: entity.quizId,
			user: entity.user,
			questions: entity.questions,
			totalTimeInSec: entity.totalTimeInSec,
			data: entity.data,
		}
	}
}
