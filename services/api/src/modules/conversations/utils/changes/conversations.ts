import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { MessagesUseCases } from '../../'
import { ConversationFromModel } from '../../data/models/conversations'
import { ConversationEntity } from '../../domain/entities/conversations'

export const ConversationDbChangeCallbacks: DbChangeCallbacks<ConversationFromModel, ConversationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`conversations/conversations/${after.user.id}`,
			`conversations/conversations/${after.id}/${after.user.id}`,
			...(after.tutor ? [`conversations/conversations/${after.tutor.id}`, `conversations/conversations/${after.id}/${after.tutor.id}`] : [])
		], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated([
			`conversations/conversations/${after.user.id}`,
			`conversations/conversations/${after.id}/${after.user.id}`,
			...(after.tutor ? [`conversations/conversations/${after.tutor.id}`, `conversations/conversations/${after.id}/${after.tutor.id}`] : [])
		], after)

		if (changes.tutor) {
			const addedTutor = !before.tutor && after.tutor
			const removedTutor = before.tutor && !after.tutor

			if (addedTutor) {
				await WalletsUseCases.updateSubscriptionData({ userId: after.user.id, key: PlanDataType.tutorAidedConversations, value: -1 })
				await UsersUseCases.updateTutorConversations({
					userId: after.tutor.id,
					conversationId: after.id,
					add: true
				})
			}

			if (removedTutor) {
				await UsersUseCases.updateTutorConversations({
					userId: before.tutor.id,
					conversationId: after.id,
					add: false
				})
			}
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`conversations/conversations/${before.user.id}`,
			`conversations/conversations/${before.id}/${before.user.id}`,
			...(before.tutor ? [`conversations/conversations/${before.tutor.id}`, `conversations/conversations/${before.id}/${before.tutor.id}`] : [])
		], before)

		if (before.tutor) await UsersUseCases.updateTutorConversations({
			userId: before.tutor.id,
			conversationId: before.id,
			add: false
		})

		await MessagesUseCases.deleteConversationMessages(before.id)
	}
}