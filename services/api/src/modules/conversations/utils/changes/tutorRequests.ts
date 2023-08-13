import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'

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
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created(
			[before.tutor.id, before.userId].map((uid) => [`conversations/tutorRequests/${uid}`, `conversations/tutorRequests/${before.id}/${uid}`]).flat(),
			before)

		if (before.pending) await WalletsUseCases.updateSubscriptionData({ userId: before.userId, key: PlanDataType.tutorAidedConversations, value: 1 })
	}
}
