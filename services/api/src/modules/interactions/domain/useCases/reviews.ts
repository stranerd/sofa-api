import type { QueryParams } from 'equipped'

import type { ReviewToModel } from '../../data/models/reviews'
import type { IReviewRepository } from '../irepositories/reviews'
import type { EmbeddedUser, Interaction } from '../types'

export class ReviewsUseCase {
	private repository: IReviewRepository

	constructor(repository: IReviewRepository) {
		this.repository = repository
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async add(data: ReviewToModel) {
		return await this.repository.add(data)
	}

	async deleteEntityReviews(entity: Interaction) {
		return await this.repository.deleteEntityReviews(entity)
	}
}
