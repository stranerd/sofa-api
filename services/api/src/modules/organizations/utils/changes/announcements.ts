import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnnouncementFromModel } from '../../data/models/announcements'
import { AnnouncementEntity } from '../../domain/entities/announcements'


export const AnnouncementDbChangeCallbacks: DbChangeCallbacks<AnnouncementFromModel, AnnouncementEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes/${after.classId}/announcements`,
			`organizations/${after.organizationId}/classes/${after.classId}/announcements/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes/${after.classId}/announcements`,
			`organizations/${after.organizationId}/classes/${after.classId}/announcements/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`organizations/${before.organizationId}/classes/${before.classId}/announcements`,
			`organizations/${before.organizationId}/classes/${before.classId}/announcements/${before.id}`
		], before)
	}
}