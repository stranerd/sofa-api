import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ScheduleFromModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../../domain/entities/schedules'


export const ScheduleDbChangeCallbacks: DbChangeCallbacks<ScheduleFromModel, ScheduleEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`organizations/${after.organizationId}/classes/${after.classId}/schedules`,
			`organizations/${after.organizationId}/classes/${after.classId}/schedules/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`organizations/${after.organizationId}/classes/${after.classId}/schedules`,
			`organizations/${after.organizationId}/classes/${after.classId}/schedules/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`organizations/${before.organizationId}/classes/${before.classId}/schedules`,
			`organizations/${before.organizationId}/classes/${before.classId}/schedules/${before.id}`
		], before)
	}
}