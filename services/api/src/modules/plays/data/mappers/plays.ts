import { QuestionEntity } from '@modules/study'
import { BaseMapper } from 'equipped'
import { PlayEntity } from '../../domain/entities/plays'
import { PlayFromModel, PlayToModel } from '../models/plays'

export class PlayMapper extends BaseMapper<PlayFromModel, PlayToModel, PlayEntity> {
	mapFrom(model: PlayFromModel | null) {
		if (!model) return null
		const { _id, title, quizId, status, user, data, sources, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt } = model
		return new PlayEntity({
			id: _id.toString(),
			title,
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
			title: entity.title,
			quizId: entity.quizId,
			user: entity.user,
			totalTimeInSec: entity.totalTimeInSec,
			data: entity.data,
			sources: entity.sources,
		}
	}
}
