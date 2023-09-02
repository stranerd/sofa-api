import { InteractionEntities, ReviewsUseCases, TagMeta, TagsUseCases, ViewsUseCases } from '@modules/interactions'
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
		const paths = after.isForTutors ? ['study/quizzes/tutors', `study/quizzes/tutors/${after.id}`] : ['study/quizzes', `study/quizzes/${after.id}`]
		await appInstance.listener.created(paths, after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.newQuiz
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.quizzes })
		await TagsUseCases.updateMeta({ ids: after.tagIds.concat(after.topicId), property: TagMeta.quizzes, value: 1 })
	},
	updated: async ({ after, before, changes }) => {
		const paths = after.isForTutors ? ['study/quizzes/tutors', `study/quizzes/tutors/${after.id}`] : ['study/quizzes', `study/quizzes/${after.id}`]
		await appInstance.listener.updated(paths, after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		if (changes.topicId || changes.tagIds) {
			const previousTags = before.tagIds.concat(before.topicId)
			const currentTags = after.tagIds.concat(after.topicId)
			const removed = previousTags.filter((t) => !currentTags.includes(t))
			const added = currentTags.filter((t) => !previousTags.includes(t))
			await Promise.all([
				TagsUseCases.updateMeta({ ids: removed, property: TagMeta.quizzes, value: -1 }),
				TagsUseCases.updateMeta({ ids: added, property: TagMeta.quizzes, value: 1 })
			])
		}
	},
	deleted: async ({ before }) => {
		const paths = before.isForTutors ? ['study/quizzes/tutors', `study/quizzes/tutors/${before.id}`] : ['study/quizzes', `study/quizzes/${before.id}`]
		await appInstance.listener.deleted(paths, before)

		if (before.courseId) await CoursesUseCases.remove({ id: before.courseId, type: Coursable.quiz, coursableId: before.id })
		await FoldersUseCases.removeProp({ prop: FolderSaved.quizzes, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.newQuiz
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.quizzes })
		await TagsUseCases.updateMeta({ ids: before.tagIds.concat(before.topicId), property: TagMeta.quizzes, value: -1 })
		await QuestionsUseCases.deleteQuizQuestions(before.id)
		await ReviewsUseCases.deleteEntityReviews({ type: InteractionEntities.quizzes, id: before.id })
		await ViewsUseCases.deleteEntityViews({ type: InteractionEntities.quizzes, id: before.id })
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	}
}