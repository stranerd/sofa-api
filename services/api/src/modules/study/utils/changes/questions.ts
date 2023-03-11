import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { QuizzesUseCases } from '../..'
import { QuestionFromModel } from '../../data/models/questions'
import { QuestionEntity } from '../../domain/entities/questions'

export const QuestionDbChangeCallbacks: DbChangeCallbacks<QuestionFromModel, QuestionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('study/questions', after)
		await appInstance.listener.created(`study/questions/${after.id}`, after)

		await QuizzesUseCases.toggleQuestion({ quizId: after.quizId, questionId: after.id, userId: after.userId, add: true })
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('study/questions', after)
		await appInstance.listener.updated(`study/questions/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('study/questions', before)
		await appInstance.listener.deleted(`study/questions/${before.id}`, before)

		await QuizzesUseCases.toggleQuestion({ quizId: before.quizId, questionId: before.id, userId: before.userId, add: false })
	}
}