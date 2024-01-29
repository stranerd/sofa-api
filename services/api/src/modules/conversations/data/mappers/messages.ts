import { BaseMapper } from 'equipped'
import { MessageEntity } from '../../domain/entities/messages'
import { MessageFromModel, MessageToModel } from '../models/messages'

export class MessageMapper extends BaseMapper<MessageFromModel, MessageToModel, MessageEntity> {
	mapFrom(model: MessageFromModel | null) {
		if (!model) return null
		const { _id, conversationId, userId, body, media, tags, starred, createdAt, updatedAt, readAt } = model
		return new MessageEntity({
			id: _id.toString(),
			conversationId,
			userId,
			body,
			media,
			tags,
			starred,
			createdAt,
			updatedAt,
			readAt,
		})
	}

	mapTo(entity: MessageEntity) {
		return {
			conversationId: entity.conversationId,
			userId: entity.userId,
			body: entity.body,
			media: entity.media,
			tags: entity.tags,
			starred: entity.starred,
		}
	}
}
