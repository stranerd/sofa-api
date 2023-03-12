import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { MessageFromModel } from '../../data/models/messages'
import { MessageEntity } from '../../domain/entities/messages'
import { generateResponse } from '../messages'

export const MessageDbChangeCallbacks: DbChangeCallbacks<MessageFromModel, MessageEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`conversations/${after.conversationId}/messages`,
			`conversations/${after.conversationId}/messages/${after.id}`
		], after)

		await generateResponse(after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`conversations/${after.conversationId}/messages`,
			`conversations/${after.conversationId}/messages/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`conversations/${before.conversationId}/messages`,
			`conversations/${before.conversationId}/messages/${before.id}`
		], before)

		if (before.media) await publishers.DELETEFILE.publish(before.media)
	}
}