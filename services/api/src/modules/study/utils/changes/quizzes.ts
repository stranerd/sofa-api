import { InteractionEntities, ReviewsUseCases, TagMeta, TagsUseCases, ViewsUseCases } from '@modules/interactions'
import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { CoursesUseCases, FoldersUseCases, QuestionsUseCases } from '../..'
import { QuizFromModel } from '../../data/models/quizzes'
import { QuizEntity } from '../../domain/entities/quizzes'
import { Coursable, DraftStatus, FolderSaved } from '../../domain/types'
import { NotificationType, sendNotification } from '@modules/notifications'

export const QuizDbChangeCallbacks: DbChangeCallbacks<QuizFromModel, QuizEntity> = {
	created: async ({ after }) => {
		const paths = after.isForTutors
			? ['study/quizzes/tutors', `study/quizzes/tutors/${after.id}`]
			: ['study/quizzes', `study/quizzes/${after.id}`]
		await appInstance.listener.created(paths, after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.newQuiz,
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.quizzes })
		await TagsUseCases.updateMeta({ ids: after.tagIds.concat(after.topicId), property: TagMeta.quizzes, value: 1 })
	},
	updated: async ({ after, before, changes }) => {
		const paths = after.isForTutors
			? ['study/quizzes/tutors', `study/quizzes/tutors/${after.id}`]
			: ['study/quizzes', `study/quizzes/${after.id}`]
		await appInstance.listener.updated(paths, after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		if (changes.topicId || changes.tagIds) {
			const previousTags = before.tagIds.concat(before.topicId)
			const currentTags = after.tagIds.concat(after.topicId)
			const removed = previousTags.filter((t) => !currentTags.includes(t))
			const added = currentTags.filter((t) => !previousTags.includes(t))
			await Promise.all([
				TagsUseCases.updateMeta({ ids: removed, property: TagMeta.quizzes, value: -1 }),
				TagsUseCases.updateMeta({ ids: added, property: TagMeta.quizzes, value: 1 }),
			])
		}

		if (changes.status && (before.status === DraftStatus.published || after.status === DraftStatus.published))
			await UsersUseCases.incrementMeta({
				id: after.user.id,
				value: after.status === DraftStatus.published ? 1 : -1,
				property: UserMeta.publishedQuizzes,
			})

		if (changes.access) {
			const newRequests = after.access.requests.filter((r) => !before.access.requests.includes(r))
			const oldRequests = before.access.requests.filter((r) => !after.access.requests.includes(r))
			const accepted = oldRequests.filter((r) => after.access.members.includes(r))
			const rejected = oldRequests.filter((r) => !after.access.members.includes(r))
			const added = after.access.members.filter((m) => !before.access.members.includes(m)).filter((m) => !accepted.includes(m))
			const removed = before.access.members.filter((m) => !after.access.members.includes(m))
			if (newRequests.length)
				await sendNotification([after.user.id], {
					title: 'New Quiz Edit Request',
					body: `Someone just requested access to edit your quiz: ${after.title}`,
					sendEmail: true,
					data: { type: NotificationType.NewQuizAccessRequest, quizId: after.id, userIds: newRequests },
				})
			if (accepted.length)
				await sendNotification(accepted, {
					title: 'Quiz Edit Request Granted',
					body: `Your request to edit ${after.title} has been accepted`,
					sendEmail: true,
					data: { type: NotificationType.QuizAccessRequestGranted, quizId: after.id },
				})
			if (rejected.length)
				await sendNotification(rejected, {
					title: 'Quiz Edit Request Rejected',
					body: `Your request to edit ${after.title} has been rejected`,
					sendEmail: true,
					data: { type: NotificationType.QuizAccessRequestRejected, quizId: after.id },
				})
			if (added.length)
				await sendNotification(added, {
					title: 'Quiz Edit Request Granted',
					body: `You have been granted access to edit ${after.title}`,
					sendEmail: true,
					data: { type: NotificationType.QuizAccessMemberGranted, quizId: after.id },
				})
			if (removed.length)
				await sendNotification(removed, {
					title: 'Quiz Edit Request Rebuked',
					body: `Your access to edit ${after.title} has been rebuked`,
					sendEmail: true,
					data: { type: NotificationType.QuizAccessMemberRebuked, quizId: after.id },
				})
		}
	},
	deleted: async ({ before }) => {
		const paths = before.isForTutors
			? ['study/quizzes/tutors', `study/quizzes/tutors/${before.id}`]
			: ['study/quizzes', `study/quizzes/${before.id}`]
		await appInstance.listener.deleted(paths, before)

		if (before.courseId)
			await CoursesUseCases.move({
				id: before.courseId,
				type: Coursable.quiz,
				coursableId: before.id,
				userId: before.user.id,
				add: false,
			}).catch()
		await FoldersUseCases.removeProp({ prop: FolderSaved.quizzes, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.newQuiz,
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.quizzes })
		if (before.status === DraftStatus.published)
			await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.publishedQuizzes })
		await TagsUseCases.updateMeta({ ids: before.tagIds.concat(before.topicId), property: TagMeta.quizzes, value: -1 })
		await QuestionsUseCases.deleteQuizQuestions(before.id)
		await ReviewsUseCases.deleteEntityReviews({ type: InteractionEntities.quizzes, id: before.id })
		await ViewsUseCases.deleteEntityViews({ type: InteractionEntities.quizzes, id: before.id })
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
}
