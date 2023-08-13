import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'

export const TutorRequestDbChangeCallbacks: DbChangeCallbacks<TutorRequestFromModel, TutorRequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`conversations/conversations/${after.conversationId}/tutorRequests`, `conversations/conversations/${after.conversationId}/tutorRequests/${after.id}`
		], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created([
			`conversations/conversations/${after.conversationId}/tutorRequests`, `conversations/conversations/${after.conversationId}/tutorRequests/${after.id}`
		], after)

		if (changes.pending && before.pending && !after.pending) {
			//
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`conversations/conversations/${before.conversationId}/tutorRequests`, `conversations/conversations/${before.conversationId}/tutorRequests/${before.id}`
		], before)
	}
}
