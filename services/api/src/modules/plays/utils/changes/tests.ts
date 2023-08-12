import { QuizMetaType, QuizzesUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { AnswersUseCases } from '../..'
import { TestFromModel } from '../../data/models/tests'
import { TestEntity } from '../../domain/entities/tests'
import { PlayTypes, PlayStatus } from '../../domain/types'
import { calculateTestResults, startTestTimer } from '../plays'

export const TestDbChangeCallbacks: DbChangeCallbacks<TestFromModel, TestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after.participants.map((uid) => [
				`plays/tests/${uid}`, `plays/tests/${after.id}/${uid}`
			]).flat(), after)

		await QuizzesUseCases.updateMeta({ id: after.quizId, property: QuizMetaType.tests, value: 1 })
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after.participants.map((uid) => [
				`plays/tests/${uid}`, `plays/tests/${after.id}/${uid}`
			]).flat(), after)

		if (before.status === PlayStatus.created && after.status === PlayStatus.started) await startTestTimer(after)
		if (before.status === PlayStatus.started && after.status === PlayStatus.ended) await calculateTestResults(after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before.participants.map((uid) => [
				`plays/tests/${uid}`, `plays/tests/${before.id}/${uid}`
			]).flat(), before)

		await QuizzesUseCases.updateMeta({ id: before.quizId, property: QuizMetaType.tests, value: -1 })
		await AnswersUseCases.deleteTypeAnswers({ type: PlayTypes.tests, typeId: before.id })
	}
}