import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswerFromModel } from '../../data/models/answers'
import { AnswerEntity } from '../../domain/entities/answers'

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
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(
			after
				.getMembers()
				.map((uid) => [
					`plays/${after.type}/${after.typeId}/answers/${uid}`,
					`plays/${after.type}/${after.typeId}/answers/${after.id}/${uid}`,
				])
				.flat(),
			after,
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
