import { InteractionEntities, ReviewsUseCases, TagMeta, TagsUseCases, ViewsUseCases } from '@modules/interactions'
import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { FilesUseCases, FoldersUseCases, QuizzesUseCases } from '../..'
import { CourseFromModel } from '../../data/models/courses'
import { CourseEntity } from '../../domain/entities/courses'
import { FolderSaved } from '../../domain/types'

export const CourseDbChangeCallbacks: DbChangeCallbacks<CourseFromModel, CourseEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['study/courses', `study/courses/${after.id}`], after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.newCourse
		})
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.courses })
		await TagsUseCases.updateMeta({ ids: after.tagIds.concat(after.topicId), property: TagMeta.courses, value: 1 })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['study/courses', `study/courses/${after.id}`], after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		if (changes.topicId || changes.tagIds) {
			const previousTags = before.tagIds.concat(before.topicId)
			const currentTags = after.tagIds.concat(after.topicId)
			const removed = previousTags.filter((t) => !currentTags.includes(t))
			const added = currentTags.filter((t) => !previousTags.includes(t))
			await Promise.all([
				TagsUseCases.updateMeta({ ids: removed, property: TagMeta.courses, value: -1 }),
				TagsUseCases.updateMeta({ ids: added, property: TagMeta.courses, value: 1 })
			])
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['study/courses', `study/courses/${before.id}`], before)

		await QuizzesUseCases.deleteCourseQuizzes(before.id)
		await FilesUseCases.deleteCourseFiles(before.id)
		await FoldersUseCases.removeProp({ prop: FolderSaved.courses, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.newCourse
		})
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.courses })
		await TagsUseCases.updateMeta({ ids: before.tagIds.concat(before.topicId), property: TagMeta.courses, value: -1 })
		await ReviewsUseCases.deleteEntityReviews({ type: InteractionEntities.courses, id: before.id })
		await ViewsUseCases.deleteEntityViews({ type: InteractionEntities.courses, id: before.id })
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	}
}