import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'
import { NotificationType, sendNotification } from '@modules/notifications'

export const TutorRequestDbChangeCallbacks: DbChangeCallbacks<TutorRequestFromModel, TutorRequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.tutor.id, after.userId].map((uid) => [`conversations/tutorRequests/${uid}`, `conversations/tutorRequests/${after.id}/${uid}`]).flat(),
			after)

		await WalletsUseCases.updateSubscriptionData({ userId: after.userId, key: PlanDataType.tutorAidedConversations, value: -1 })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created(
			[after.tutor.id, after.userId].map((uid) => [`conversations/tutorRequests/${uid}`, `conversations/tutorRequests/${after.id}/${uid}`]).flat(),
			after)

		if (changes.pending && before.pending && !after.pending) {
			if (!after.accepted) await WalletsUseCases.updateSubscriptionData({ userId: after.userId, key: PlanDataType.tutorAidedConversations, value: 1 })
			await sendNotification([after.userId], {
				title: `Tutor request ${after.accepted ? 'accepted' : 'declined'}`,
				body: after.accepted ? `Your tutor request has been accepted by ${after.tutor.bio.name}` : `Your tutor request has been declined by ${after.tutor.bio.name}. You can send a new request to a different tutor`,
				sendEmail: true,
				data: {
					type: NotificationType.TutorAddedToConversation,
					accepted: after.accepted,
					tutorId: after.tutor.id,
					conversationId: after.conversationId
				}
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(
			[before.tutor.id, before.userId].map((uid) => [`conversations/tutorRequests/${uid}`, `conversations/tutorRequests/${before.id}/${uid}`]).flat(),
			before)

		if (before.pending) await WalletsUseCases.updateSubscriptionData({ userId: before.userId, key: PlanDataType.tutorAidedConversations, value: 1 })
	}
}
