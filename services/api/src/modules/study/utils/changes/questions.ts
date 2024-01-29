import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { QuizzesUseCases } from '../..'
import { QuestionFromModel } from '../../data/models/questions'
import { QuestionEntity } from '../../domain/entities/questions'

export const QuestionDbChangeCallbacks: DbChangeCallbacks<QuestionFromModel, QuestionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[`study/quizzes/${after.quizId}/questions`, `study/quizzes/${after.quizId}/questions/${after.id}`],
			after,
		)

		await QuizzesUseCases.toggleQuestion({ quizId: after.quizId, questionId: after.id, userId: after.userId, add: true })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(
			[`study/quizzes/${after.quizId}/questions`, `study/quizzes/${after.quizId}/questions/${after.id}`],
			after,
		)
		if (changes.questionMedia && before.questionMedia) await publishers.DELETEFILE.publish(before.questionMedia)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[`study/quizzes/${before.quizId}/questions`, `study/quizzes/${before.quizId}/questions/${before.id}`],
			before,
		)

		await QuizzesUseCases.toggleQuestion({ quizId: before.quizId, questionId: before.id, userId: before.userId, add: false })
		if (before.questionMedia) await publishers.DELETEFILE.publish(before.questionMedia)
	},
}
