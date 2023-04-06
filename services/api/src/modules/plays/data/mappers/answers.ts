import { BaseMapper } from 'equipped'
import { AnswerEntity } from '../../domain/entities/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'

export class AnswerMapper extends BaseMapper<AnswerFromModel, AnswerToModel, AnswerEntity> {
	mapFrom (model: AnswerFromModel | null) {
		if (!model) return null
		const { _id, gameId, userId, data, createdAt, updatedAt } = model
		return new AnswerEntity({
			id: _id.toString(), gameId, userId, data, createdAt, updatedAt
		})
	}

	mapTo (entity: AnswerEntity) {
		return {
			gameId: entity.gameId,
			userId: entity.userId
		}
	}
}