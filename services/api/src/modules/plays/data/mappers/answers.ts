import { BaseMapper } from 'equipped'
import { AnswerEntity } from '../../domain/entities/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'

export class AnswerMapper extends BaseMapper<AnswerFromModel, AnswerToModel, AnswerEntity> {
	mapFrom(model: AnswerFromModel | null) {
		if (!model) return null
		const { _id, type, typeId, typeUserId, userId, data, timedOutAt, endedAt, createdAt, updatedAt } = model
		return new AnswerEntity({
			id: _id.toString(),
			type,
			typeId,
			typeUserId,
			userId,
			data,
			timedOutAt,
			endedAt,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: AnswerEntity) {
		return {
			type: entity.type,
			typeId: entity.typeId,
			userId: entity.userId,
			questionId: '',
			answer: true,
		}
	}
}
