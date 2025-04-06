import type { DbChangeCallbacks } from 'equipped'

import { NotificationType, sendNotification } from '@modules/notifications'
import { QuizzesUseCases } from '@modules/study'
import { TutorRequestsUseCases } from '@modules/users'
import { appInstance } from '@utils/types'

import { AnswersUseCases } from '../..'
import type { PlayFromModel } from '../../data/models/plays'
import type { PlayEntity } from '../../domain/entities/plays'
import { PlayStatus } from '../../domain/types'
import { calculatePlayResults, postPlayScored, startPlayTimer } from '../plays'

export const PlaysDbChangeCallbacks: DbChangeCallbacks<PlayFromModel, PlayEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after
				.getMembers()
				.map((uid) => [`plays/plays/${uid}`, `plays/plays/${after.id}/${uid}`])
				.flat(),
			after,
		)
		await QuizzesUseCases.updateMeta({ id: after.quizId, property: after.getQuizMetaType(), value: 1 })
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after
				.getMembers()
				.map((uid) => [`plays/plays/${uid}`, `plays/plays/${after.id}/${uid}`])
				.flat(),
			{ after, before },
		)

		if (before.status === PlayStatus.created && after.status === PlayStatus.started) await startPlayTimer(after)
		if (before.status === PlayStatus.started && after.status === PlayStatus.ended)
			await Promise.all([calculatePlayResults(after), after.isTutorTest() && TutorRequestsUseCases.markTestFinished(after.id)])
		if (before.status === PlayStatus.ended && after.status === PlayStatus.scored) await postPlayScored(after)

		if (after.isGame()) {
			const joined = after.getMembers().filter((uid) => !before.getMembers().includes(uid) && uid !== after.user.id)
			await Promise.all(
				joined.map(async (uid) =>
					sendNotification([after.user.id], {
						title: 'New player joined',
						body: 'Someone new just joined your game',
						sendEmail: false,
						data: { type: NotificationType.UserJoinedGame, gameId: after.id, userId: uid },
					}),
				),
			)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before
				.getMembers()
				.map((uid) => [`plays/plays/${uid}`, `plays/plays/${before.id}/${uid}`])
				.flat(),
			before,
		)

		await QuizzesUseCases.updateMeta({ id: before.quizId, property: before.getQuizMetaType(), value: -1 })
		await AnswersUseCases.deleteTypeAnswers({ type: before.type, typeId: before.id })
	},
}
