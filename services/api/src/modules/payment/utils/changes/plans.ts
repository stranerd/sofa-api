import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { PlanFromModel } from '../../data/models/plans'
import { PlanEntity } from '../../domain/entities/plans'

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
