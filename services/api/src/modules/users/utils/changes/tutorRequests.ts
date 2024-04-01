import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'
import { publishers } from '@utils/events'
import { UsersUseCases } from '@modules/users'

export const TutorRequestDbChangeCallbacks: DbChangeCallbacks<TutorRequestFromModel, TutorRequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['users/tutorRequests', `users/tutorRequests/${after.id}`], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['users/tutorRequests', `users/tutorRequests/${after.id}`], after)

		if (changes.pending && before.pending && !after.pending && after.accepted) {
			if (after.accepted.is)
				await UsersUseCases.updateTutorTopics({
					userId: after.userId,
					topicId: after.topicId,
					add: true,
				})

			await sendNotification([after.userId], {
				title: 'Tutor Request Status',
				body: `Your tutor request has been ${after.accepted.is ? 'accepted' : 'rejected'}`,
				sendEmail: true,
				data: {
					type: after.accepted ? NotificationType.TutorRequestAccepted : NotificationType.TutorRequestRejected,
					tutorRequestId: after.id,
				},
			})
		}

		if (changes.verification) await publishers.DELETEFILE.publish(before.verification)
		if (changes.qualification) {
			const removed = before.qualification.filter((file) => !after.qualification.find((f) => f.path === file.path))
			await Promise.all(removed.map((file) => publishers.DELETEFILE.publish(file)))
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['users/tutorRequests', `users/tutorRequests/${before.id}`], before)

		await publishers.DELETEFILE.publish(before.verification)
		await Promise.all(before.qualification.map((file) => publishers.DELETEFILE.publish(file)))
	},
}
