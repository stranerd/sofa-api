import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { MessagesUseCases } from '../../'
import { ConversationFromModel } from '../../data/models/conversations'
import { ConversationEntity } from '../../domain/entities/conversations'

export const ConversationDbChangeCallbacks: DbChangeCallbacks<ConversationFromModel, ConversationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`conversations/conversations/${after.user.id}`,
			`conversations/conversations/${after.id}/${after.user.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`conversations/conversations/${after.user.id}`,
			`conversations/conversations/${after.id}/${after.user.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`conversations/conversations/${before.user.id}`,
			`conversations/conversations/${before.id}/${before.user.id}`
		], before)

		await MessagesUseCases.deleteConversationMessages(before.id)
	}
}