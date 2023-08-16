import { QuizMetaType, QuizzesUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswersUseCases } from '../..'
import { GameFromModel } from '../../data/models/games'
import { GameEntity } from '../../domain/entities/games'
import { PlayTypes, PlayStatus } from '../../domain/types'
import { calculateGameResults, startGameTimer } from '../plays'
import { NotificationType, sendNotification } from '@modules/notifications'

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

		const joined = after.participants.filter((uid) => !before.participants.includes(uid) && uid !== after.user.id)
		await Promise.all(
			joined.map(async (uid) => sendNotification([after.user.id], {
				title: 'New player joined',
				body: 'Someone new just joined your game',
				sendEmail: false,
				data: { type: NotificationType.UserJoinedGame, gameId: after.id, userId: uid}
			}))
		)
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