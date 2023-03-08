import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { UsersUseCases } from '../../'
import { ConnectFromModel } from '../../data/models/connects'
import { ConnectEntity } from '../../domain/entities/connects'
import { UserMeta } from '../../domain/types'

export const ConnectDbChangeCallbacks: DbChangeCallbacks<ConnectFromModel, ConnectEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`users/connects/${after.from.id}`, after)
		await appInstance.listener.created(`users/connects/${after.to.id}`, after)
		await appInstance.listener.created(`users/connects/${after.id}/${after.from.id}`, after)
		await appInstance.listener.created(`users/connects/${after.id}/${after.to.id}`, after)
		await sendNotification([after.to.id], {
			title: `${after.from.bio.fullName} is requesting to connect`,
			sendEmail: false,
			body: 'Check out their profile',
			data: { type: NotificationType.ConnectRequested, connectId: after.id, userId: after.from.id }
		})
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated(`users/connects/${after.from.id}`, after)
		await appInstance.listener.updated(`users/connects/${after.to.id}`, after)
		await appInstance.listener.updated(`users/connects/${after.id}/${after.from.id}`, after)
		await appInstance.listener.updated(`users/connects/${after.id}/${after.to.id}`, after)

		if (changes.pending && !after.pending) await Promise.all([
			after.accepted && UsersUseCases.incrementMeta({
				id: after.from.id, property: UserMeta.connects, value: after.accepted ? 1 : -1
			}),
			after.accepted && UsersUseCases.incrementMeta({
				id: after.to.id, property: UserMeta.connects, value: after.accepted ? 1 : -1
			}),
			after.accepted ? sendNotification([after.from.id], {
				title: `${after.from.bio.fullName} accepted your request`,
				sendEmail: false,
				body: 'Go message them!',
				data: { type: NotificationType.ConnectAccepted, connectId: after.id, userId: after.to.id }
			}) : sendNotification([after.from.id], {
				title: `${after.from.bio.fullName} declined your request`,
				sendEmail: false,
				body: 'Try connecting later!',
				data: { type: NotificationType.ConnectDeclined, connectId: after.id, userId: after.to.id }
			})
		])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`users/connects/${before.from.id}`, before)
		await appInstance.listener.deleted(`users/connects/${before.to.id}`, before)
		await appInstance.listener.deleted(`users/connects/${before.id}/${before.from.id}`, before)
		await appInstance.listener.deleted(`users/connects/${before.id}/${before.to.id}`, before)

		if (before.accepted) await Promise.all([
			UsersUseCases.incrementMeta({ id: before.from.id, property: UserMeta.connects, value: -1 }),
			UsersUseCases.incrementMeta({ id: before.to.id, property: UserMeta.connects, value: -1 })
		])
	}
}
