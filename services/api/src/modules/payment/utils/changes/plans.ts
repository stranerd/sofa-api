import { DbChangeCallbacks } from 'equipped'
import { appInstance } from '@utils/types'
import { PlanFromModel } from '../../data/models/plans'
import { PlanEntity } from '../../domain/entities/plans'

export const PlanDbChangeCallbacks: DbChangeCallbacks<PlanFromModel, PlanEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('payment/plans', after)
		await appInstance.listener.created(`payment/plans/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('payment/plans', after)
		await appInstance.listener.updated(`payment/plans/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('payment/plans', before)
		await appInstance.listener.deleted(`payment/plans/${before.id}`, before)
	}
}