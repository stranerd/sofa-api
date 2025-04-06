import type { DbChangeCallbacks } from 'equipped'
import { DelayedJobs } from 'equipped'

import { appInstance } from '@utils/types'

import type { AnswerFromModel } from '../../data/models/answers'
import type { AnswerEntity } from '../../domain/entities/answers'

export const AnswerDbChangeCallbacks: DbChangeCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after
				.getMembers()
				.map((uid) => [
					`plays/${after.type}/${after.typeId}/answers/${uid}`,
					`plays/${after.type}/${after.typeId}/answers/${after.id}/${uid}`,
				])
				.flat(),
			after,
		)

		if (after.timedOutAt) {
			const cacheKey = `plays-answers-${after.type}-${after.typeId}-timer`
			const cachedJobId = await appInstance.cache.get(cacheKey)
			if (!cachedJobId) {
				let endsIn = after.timedOutAt - Date.now()
				if (endsIn < 3000) endsIn = 3000
				const jobId = await appInstance.job.addDelayedJob(
					{
						type: DelayedJobs.PlayAnswerTimer,
						data: { type: after.type, typeId: after.typeId, userId: after.userId },
					},
					endsIn,
				)
				await appInstance.cache.set(cacheKey, jobId, Math.ceil(endsIn / 1000))
			}
		}
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after
				.getMembers()
				.map((uid) => [
					`plays/${after.type}/${after.typeId}/answers/${uid}`,
					`plays/${after.type}/${after.typeId}/answers/${after.id}/${uid}`,
				])
				.flat(),
			{ after, before },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before
				.getMembers()
				.map((uid) => [
					`plays/${before.type}/${before.typeId}/answers/${uid}`,
					`plays/${before.type}/${before.typeId}/answers/${before.id}/${uid}`,
				])
				.flat(),
			before,
		)
	},
}
