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
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['study/courses', `study/courses/${after.id}`], after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)
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
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	}
}