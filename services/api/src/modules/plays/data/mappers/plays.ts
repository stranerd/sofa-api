import { QuestionEntity } from '@modules/study'
import { BaseMapper } from 'equipped'
import { PlayEntity } from '../../domain/entities/plays'
import { PlayFromModel, PlayToModel } from '../models/plays'

export class PlayMapper extends BaseMapper<PlayFromModel, PlayToModel, PlayEntity> {
	mapFrom(model: PlayFromModel | null) {
		if (!model) return null
		const { _id, quizId, status, user, data, sources, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt } = model
		return new PlayEntity({
			id: _id.toString(),
			quizId,
			status,
			user,
			data,
			sources: sources.map((source) => new QuestionEntity(source)),
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
			totalTimeInSec: entity.totalTimeInSec,
			data: entity.data,
			sources: entity.sources,
		}
	}
}
