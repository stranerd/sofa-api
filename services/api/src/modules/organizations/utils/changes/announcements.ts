import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ClassesUseCases } from '../../'
import { AnnouncementFromModel } from '../../data/models/announcements'
import { AnnouncementEntity } from '../../domain/entities/announcements'

export const AnnouncementDbChangeCallbacks: DbChangeCallbacks<AnnouncementFromModel, AnnouncementEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`organizations/${after.organizationId}/classes/${after.classId}/announcements`,
				`organizations/${after.organizationId}/classes/${after.classId}/announcements/${after.id}`,
			],
			after,
		)

		const classInst = await ClassesUseCases.find(after.classId)
		if (classInst)
			await sendNotification(after.getRecipients(classInst), {
				title: `Announcement in class: ${classInst.title}`,
				body: after.body,
				sendEmail: true,
				data: {
					type: NotificationType.ClassAnnouncementCreated,
					organizationId: classInst.organizationId,
					classId: classInst.id,
					announcementId: after.id,
				},
			})
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(
			[
				`organizations/${after.organizationId}/classes/${after.classId}/announcements`,
				`organizations/${after.organizationId}/classes/${after.classId}/announcements/${after.id}`,
			],
			after,
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`organizations/${before.organizationId}/classes/${before.classId}/announcements`,
				`organizations/${before.organizationId}/classes/${before.classId}/announcements/${before.id}`,
			],
			before,
		)
	},
}
