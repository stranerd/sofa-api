import type { DbChangeCallbacks } from 'equipped'

import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'

import type { MessageFromModel } from '../../data/models/messages'
import type { MessageEntity } from '../../domain/entities/messages'
import { generateResponse } from '../messages'

export const MessageDbChangeCallbacks: DbChangeCallbacks<MessageFromModel, MessageEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`conversations/conversations/${after.conversationId}/messages`,
				`conversations/conversations/${after.conversationId}/messages/${after.id}`,
			],
			after,
		)

		await generateResponse(after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[
				`conversations/conversations/${after.conversationId}/messages`,
				`conversations/conversations/${after.conversationId}/messages/${after.id}`,
			],
			{ before, after },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`conversations/conversations/${before.conversationId}/messages`,
				`conversations/conversations/${before.conversationId}/messages/${before.id}`,
			],
			before,
		)

		if (before.media) await publishers.DELETEFILE.publish(before.media)
	},
}
