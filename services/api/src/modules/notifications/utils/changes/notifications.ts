import { UsersUseCases } from '@modules/users'
import { clientDomain } from '@utils/environment'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks, EmailsList, readEmailFromPug } from 'equipped'
import { NotificationFromModel } from '../../data/models/notifications'
import { NotificationEntity } from '../../domain/entities/notifications'
import { sendPushNotification } from '../push'

export const NotificationDbChangeCallbacks: DbChangeCallbacks<NotificationFromModel, NotificationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`notifications/notifications/${after.userId}`,
			`notifications/notifications/${after.id}/${after.userId}`
		], after)

		await sendPushNotification({
			userIds: [after.userId],
			title: after.title, body: after.body,
			data: {
				type: 'notifications',
				data: { id: after.id, data: after.data }
			}
		})

		if (after.sendEmail) {
			const user = await UsersUseCases.find(after.userId)
			if (user) {
				const content = await readEmailFromPug('emails/newNotification.pug', {
					notification: after, meta: { link: clientDomain }
				})
				await publishers.SENDMAIL.publish({
					from: EmailsList.NO_REPLY, to: user.bio.email, subject: after.title,
					content, data: {}
				})
			}
		}
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`notifications/notifications/${after.userId}`,
			`notifications/notifications/${after.id}/${after.userId}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`notifications/notifications/${before.userId}`,
			`notifications/notifications/${before.id}/${before.userId}`
		], before)
	}
}