import { QuizMetaType, QuizzesUseCases } from '@modules/study'
import { TutorRequestsUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswersUseCases } from '../..'
import { TestFromModel } from '../../data/models/tests'
import { TestEntity } from '../../domain/entities/tests'
import { PlayTypes, PlayStatus } from '../../domain/types'
import { calculateTestResults, postScoreTest, startTestTimer } from '../plays'

export const TestDbChangeCallbacks: DbChangeCallbacks<TestFromModel, TestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`plays/tests/${after.userId}`, `plays/tests/${after.id}/${after.userId}`
		], after)

		await QuizzesUseCases.updateMeta({ id: after.quizId, property: QuizMetaType.tests, value: 1 })
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([
			`plays/tests/${after.userId}`, `plays/tests/${after.id}/${after.userId}`
		], after)

		if (before.status === PlayStatus.created && after.status === PlayStatus.started) await startTestTimer(after)
		if (before.status === PlayStatus.started && after.status === PlayStatus.ended) await Promise.all([
			calculateTestResults(after),
			TutorRequestsUseCases.markTestFinished(after.id)
		])
		if (before.status === PlayStatus.ended && after.status === PlayStatus.scored) await postScoreTest(after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`plays/tests/${before.userId}`, `plays/tests/${before.id}/${before.userId}`
		], before)

		await QuizzesUseCases.updateMeta({ id: before.quizId, property: QuizMetaType.tests, value: -1 })
		await AnswersUseCases.deleteTypeAnswers({ type: PlayTypes.tests, typeId: before.id })
	}
}