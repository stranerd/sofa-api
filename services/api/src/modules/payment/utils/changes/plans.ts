import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { PlanFromModel } from '../../data/models/plans'
import type { PlanEntity } from '../../domain/entities/plans'

export const PlanDbChangeCallbacks: DbChangeCallbacks<PlanFromModel, PlanEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['payment/plans', `payment/plans/${after.id}`], after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(['payment/plans', `payment/plans/${after.id}`], { after, before })
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['payment/plans', `payment/plans/${before.id}`], before)
	},
}
