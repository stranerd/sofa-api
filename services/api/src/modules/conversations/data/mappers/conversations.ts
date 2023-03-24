import { BaseMapper } from 'equipped'
import { ConversationEntity } from '../../domain/entities/conversations'
import { ConversationFromModel, ConversationToModel } from '../models/conversations'
import { MessageMapper } from './messages'

export class ConversationMapper extends BaseMapper<ConversationFromModel, ConversationToModel, ConversationEntity> {
	mapFrom (model: ConversationFromModel | null) {
		if (!model) return null
		const { _id, title, user, tutor, createdAt, updatedAt, last, readAt } = model
		const lastData = new MessageMapper().mapFrom(last)
		return new ConversationEntity({
			id: _id.toString(), title, user, tutor, createdAt, updatedAt,
			last: lastData, readAt
		})
	}

	mapTo (entity: ConversationEntity) {
		return {
			title: entity.title,
			user: entity.user
		}
	}
}