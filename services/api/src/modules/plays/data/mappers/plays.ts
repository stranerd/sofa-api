import { BaseMapper } from 'equipped'

import { QuestionEntity } from '@modules/study'

import { PlayEntity } from '../../domain/entities/plays'
import type { PlayFromModel, PlayToModel } from '../models/plays'

export class PlayMapper extends BaseMapper<PlayFromModel, PlayToModel, PlayEntity> {
	mapFrom(model: PlayFromModel | null) {
		if (!model) return null
		const {
			_id,
			title,
			quizId,
			status,
			user,
			data,
			sources,
			totalTimeInSec,
			timing,
			scores,
			startedAt,
			endedAt,
			createdAt,
			updatedAt,
		} = model
		return new PlayEntity({
			id: _id.toString(),
			title,
			quizId,
			status,
			user,
			data,
			sources: sources.map((source) => new QuestionEntity(source)),
			totalTimeInSec,
			timing,
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
			timing: entity.timing,
			data: entity.data,
			sources: entity.sources,
		}
	}
}
