import { AuthUsersUseCases } from '@modules/auth'
import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/types'
import { AuthRole, DbChangeCallbacks } from 'equipped'
import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'

export const TutorRequestDbChangeCallbacks: DbChangeCallbacks<TutorRequestFromModel, TutorRequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			'users/tutorRequests', `users/tutorRequests/${after.id}`
		], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.created([
			'users/tutorRequests', `users/tutorRequests/${after.id}`
		], after)

		if (changes.pending && before.pending && !after.pending) {
			if (after.accepted) await AuthUsersUseCases.updateUserRole({
				userId: after.userId, roles: { [AuthRole.isTutor]: true }
			})

			await sendNotification([after.userId], {
				title: 'Tutor Request Status',
				body: `Your tutor request has been ${after.accepted ? 'accepted' : 'rejected'}`,
				sendEmail: true,
				data: {
					type: after.accepted ? NotificationType.TutorRequestAccepted : NotificationType.TutorRequestRejected,
					tutorRequestId: after.id
				}
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			'users/tutorRequests', `users/tutorRequests/${before.id}`
		], before)
	}
}
