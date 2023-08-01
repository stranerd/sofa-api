import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswerFromModel } from '../../data/models/answers'
import { AnswerEntity } from '../../domain/entities/answers'

export const AnswerDbChangeCallbacks: DbChangeCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`plays/games/${after.gameId}/answers`, `plays/games/${after.gameId}/answers/${after.id}`
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.created([
			`plays/games/${after.gameId}/answers`, `plays/games/${after.gameId}/answers/${after.id}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.created([
			`plays/games/${before.gameId}/answers`, `plays/games/${before.gameId}/answers/${before.id}`
		], before)
	}
}