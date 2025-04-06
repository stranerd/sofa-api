import type { QueryParams } from 'equipped'

import type { LikeToModel } from '../../data/models/likes'
import type { ILikeRepository } from '../irepositories/likes'
import type { Interaction } from '../types'

export class LikesUseCase {
	repository: ILikeRepository

	constructor(repo: ILikeRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async like(data: LikeToModel) {
		return await this.repository.like(data)
	}

	async deleteEntityLikes(entity: Interaction) {
		return await this.repository.deleteEntityLikes(entity)
	}

	async updateUserBio(user: LikeToModel['user']) {
		return await this.repository.updateUserBio(user)
	}
}
