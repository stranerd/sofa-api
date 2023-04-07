import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { CoursesUseCases, FoldersUseCases, QuestionsUseCases } from '../..'
import { QuizFromModel } from '../../data/models/quizzes'
import { QuizEntity } from '../../domain/entities/quizzes'
import { Coursable, FolderSaved } from '../../domain/types'

export const QuizDbChangeCallbacks: DbChangeCallbacks<QuizFromModel, QuizEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['study/quizzes', `study/quizzes/${after.id}`], after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.newQuiz
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.quizzes })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['study/quizzes', `study/quizzes/${after.id}`], after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['study/quizzes', `study/quizzes/${before.id}`], before)

		if (before.courseId) await CoursesUseCases.remove({ id: before.courseId, type: Coursable.quiz, coursableId: before.id })
		await FoldersUseCases.removeProp({ prop: FolderSaved.quizzes, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.newQuiz
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.quizzes })
		await QuestionsUseCases.deleteQuizQuestions(before.id)
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	}
}