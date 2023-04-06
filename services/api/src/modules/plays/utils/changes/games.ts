import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswersUseCases } from '../..'
import { GameFromModel } from '../../data/models/games'
import { GameEntity } from '../../domain/entities/games'
import { GameStatus } from '../../domain/types'
import { calculateGameResults, startGameTimer } from '../games'

export const GameDbChangeCallbacks: DbChangeCallbacks<GameFromModel, GameEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after.participants.concat(after.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${after.id}/${uid}`
			]).flat(), after)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after.participants.concat(after.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${after.id}/${uid}`
			]).flat(), after)

		if (before.status === GameStatus.created && after.status === GameStatus.started) await startGameTimer(after)
		if (before.status === GameStatus.started && after.status === GameStatus.ended) await calculateGameResults(after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before.participants.concat(before.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${before.id}/${uid}`
			]).flat(), before)

		await AnswersUseCases.deleteGameAnswers(before.id)
	}
}