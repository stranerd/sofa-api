import type { QueryParams } from 'equipped'

import { getPlansList } from '../../utils/plans'
import type { IPlanRepository } from '../irepositories/plans'

export class PlansUseCase {
	repository: IPlanRepository

	constructor(repo: IPlanRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async init() {
		return await this.repository.init(getPlansList())
	}
}
