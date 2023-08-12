import { QuizMetaType, QuizzesUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswersUseCases } from '../..'
import { GameFromModel } from '../../data/models/games'
import { GameEntity } from '../../domain/entities/games'
import { PlayTypes, PlayStatus } from '../../domain/types'
import { calculateGameResults, startGameTimer } from '../plays'

export const GameDbChangeCallbacks: DbChangeCallbacks<GameFromModel, GameEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after.participants.concat(after.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${after.id}/${uid}`
			]).flat(), after)

		await QuizzesUseCases.updateMeta({ id: after.quizId, property: QuizMetaType.games, value: 1 })
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after.participants.concat(after.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${after.id}/${uid}`
			]).flat(), after)

		if (before.status === PlayStatus.created && after.status === PlayStatus.started) await startGameTimer(after)
		if (before.status === PlayStatus.started && after.status === PlayStatus.ended) await calculateGameResults(after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before.participants.concat(before.user.id).map((uid) => [
				`plays/games/${uid}`, `plays/games/${before.id}/${uid}`
			]).flat(), before)

		await QuizzesUseCases.updateMeta({ id: before.quizId, property: QuizMetaType.games, value: -1 })
		await AnswersUseCases.deleteTypeAnswers({ type: PlayTypes.games, typeId: before.id })
	}
}