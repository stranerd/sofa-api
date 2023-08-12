import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswerFromModel } from '../../data/models/answers'
import { AnswerEntity } from '../../domain/entities/answers'

export const AnswerDbChangeCallbacks: DbChangeCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`plays/${after.type}/${after.typeId}/answers`, `plays/${after.type}/${after.typeId}/answers/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`plays/${after.type}/${after.typeId}/answers`, `plays/${after.type}/${after.typeId}/answers/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`plays/${before.type}/${before.typeId}/answers`, `plays/${before.type}/${before.typeId}/answers/${before.id}`
		], before)
	}
}