import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { ReviewFromModel } from '../../data/models/reviews'
import { ReviewEntity } from '../../domain/entities/reviews'

export const ReviewDbChangeCallbacks: DbChangeCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['conversations/reviews', `conversations/reviews/${after.id}`], after)
		await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['conversations/reviews', `conversations/reviews/${after.id}`], after)
		if (changes.rating || changes.to) {
			await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
			await UsersUseCases.updateRatings({ userId: after.to, ratings: after.rating, add: true })
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['conversations/reviews', `conversations/reviews/${before.id}`], before)
		await UsersUseCases.updateRatings({ userId: before.to, ratings: before.rating, add: false })
	}
}