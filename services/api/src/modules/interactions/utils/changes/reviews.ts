import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ReviewFromModel } from '../../data/models/reviews'
import { ReviewEntity } from '../../domain/entities/reviews'
import { InteractionEntities } from '@modules/interactions/domain/types'
import { CoursesUseCases, QuizzesUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'

export const ReviewDbChangeCallbacks: DbChangeCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/reviews', `interactions/reviews/${after.id}`], after)

		if (after.entity.type === InteractionEntities.courses) await CoursesUseCases.updateRatings({ id: after.entity.id, ratings: after.rating, add: true })
		if (after.entity.type === InteractionEntities.quizzes) await QuizzesUseCases.updateRatings({ id: after.entity.id, ratings: after.rating, add: true })
		if (after.entity.type === InteractionEntities.tutorConversations) await UsersUseCases.updateRatings({ id: after.entity.userId, ratings: after.rating, add: true })
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['interactions/reviews', `interactions/reviews/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/reviews', `interactions/reviews/${before.id}`], before)

		if (before.entity.type === InteractionEntities.courses) await CoursesUseCases.updateRatings({ id: before.entity.id, ratings: before.rating, add: false })
		if (before.entity.type === InteractionEntities.quizzes) await QuizzesUseCases.updateRatings({ id: before.entity.id, ratings: before.rating, add: false })
		if (before.entity.type === InteractionEntities.tutorConversations) await UsersUseCases.updateRatings({ id: before.entity.userId, ratings: before.rating, add: false })

	}
}