import { BaseMapper } from 'equipped'
import { CardEntity } from '../../domain/entities/cards'
import { CardFromModel, CardToModel } from '../models/cards'

export class CardMapper extends BaseMapper<CardFromModel, CardToModel, CardEntity> {
	mapFrom (model: CardFromModel | null) {
		if (!model) return null
		const { _id, title, set, user, tagId, status, price, createdAt, updatedAt } = model
		return new CardEntity({
			id: _id.toString(), title, set, user, tagId, status, price, createdAt, updatedAt
		})
	}

	mapTo (entity: CardEntity) {
		return {
			title: entity.title,
			set: entity.set,
			user: entity.user,
			tagId: entity.tagId,
			status: entity.status,
			price: entity.price
		}
	}
}