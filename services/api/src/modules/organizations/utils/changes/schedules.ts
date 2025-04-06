import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { ScheduleFromModel } from '../../data/models/schedules'
import type { ScheduleEntity } from '../../domain/entities/schedules'

export const ScheduleDbChangeCallbacks: DbChangeCallbacks<ScheduleFromModel, ScheduleEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`organizations/${after.organizationId}/classes/${after.classId}/schedules`,
				`organizations/${after.organizationId}/classes/${after.classId}/schedules/${after.id}`,
			],
			after,
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[
				`organizations/${after.organizationId}/classes/${after.classId}/schedules`,
				`organizations/${after.organizationId}/classes/${after.classId}/schedules/${after.id}`,
			],
			{ after, before },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`organizations/${before.organizationId}/classes/${before.classId}/schedules`,
				`organizations/${before.organizationId}/classes/${before.classId}/schedules/${before.id}`,
			],
			before,
		)
	},
}
