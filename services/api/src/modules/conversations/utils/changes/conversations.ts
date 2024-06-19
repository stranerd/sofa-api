import { InteractionEntities, ReviewsUseCases } from '@modules/interactions'
import { NotificationType, sendNotification } from '@modules/notifications'
import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { MessagesUseCases } from '../../'
import { ConversationFromModel } from '../../data/models/conversations'
import { ConversationEntity } from '../../domain/entities/conversations'

export const ConversationDbChangeCallbacks: DbChangeCallbacks<ConversationFromModel, ConversationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`conversations/conversations/${after.user.id}`,
				`conversations/conversations/${after.id}/${after.user.id}`,
				...(after.tutor
					? [`conversations/conversations/${after.tutor.id}`, `conversations/conversations/${after.id}/${after.tutor.id}`]
					: []),
			],
			after,
		)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(
			[
				`conversations/conversations/${after.user.id}`,
				`conversations/conversations/${after.id}/${after.user.id}`,
				...(after.tutor
					? [`conversations/conversations/${after.tutor.id}`, `conversations/conversations/${after.id}/${after.tutor.id}`]
					: []),
			],
			{ before, after },
		)

		const justAccepted = changes.accepted && !before.accepted && after.accepted
		if (justAccepted && after.tutor) {
			if (after.accepted?.is)
				await UsersUseCases.updateTutorConversations({
					userId: after.tutor.id,
					conversationId: after.id,
					add: true,
				})
			else
				await WalletsUseCases.updateSubscriptionData({ userId: after.user.id, key: PlanDataType.tutorAidedConversations, value: 1 })

			await sendNotification([after.user.id], {
				title: `Tutor request ${after.accepted ? 'accepted' : 'declined'}`,
				body: after.accepted
					? `Your tutor request has been accepted by ${after.tutor.bio.name}`
					: `Your tutor request has been declined by ${after.tutor.bio.name}. You can send a new request to a different tutor`,
				sendEmail: true,
				data: {
					type: NotificationType.TutorAddedToConversation,
					accepted: after.accepted!.is,
					tutorId: after.tutor.id,
					conversationId: after.id,
				},
			})
		}

		const justEnded = changes.ended && !before.ended && after.ended
		if (justEnded && before.tutor)
			await Promise.all([
				UsersUseCases.updateTutorConversations({ userId: before.tutor.id, conversationId: after.id, add: false }),
				ReviewsUseCases.add({
					user: after.user,
					rating: after.ended!.rating,
					message: after.ended!.message,
					entity: { type: InteractionEntities.conversations, id: after.id, userId: before.tutor.id },
				}),
			])

		if (changes.pending && before.pending && !after.pending && !before.accepted && after.accepted && after.tutor) {
			if (!after.accepted)
				await WalletsUseCases.updateSubscriptionData({ userId: after.user.id, key: PlanDataType.tutorAidedConversations, value: 1 })
			await sendNotification([after.user.id], {
				title: `Tutor request ${after.accepted ? 'accepted' : 'declined'}`,
				body: after.accepted
					? `Your tutor request has been accepted by ${after.tutor.bio.name}`
					: `Your tutor request has been declined by ${after.tutor.bio.name}. You can send a new request to a different tutor`,
				sendEmail: true,
				data: {
					type: NotificationType.TutorAddedToConversation,
					accepted: after.accepted.is,
					tutorId: after.tutor.id,
					conversationId: after.id,
				},
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`conversations/conversations/${before.user.id}`,
				`conversations/conversations/${before.id}/${before.user.id}`,
				...(before.tutor
					? [`conversations/conversations/${before.tutor.id}`, `conversations/conversations/${before.id}/${before.tutor.id}`]
					: []),
			],
			before,
		)

		if (before.tutor && before.accepted?.is)
			await UsersUseCases.updateTutorConversations({
				userId: before.tutor.id,
				conversationId: before.id,
				add: false,
			})

		await MessagesUseCases.deleteConversationMessages(before.id)
	},
}
