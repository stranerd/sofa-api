import { QueryParams } from 'equipped'
import { PurchaseToModel } from '../../data/models/purchases'
import { IPurchaseRepository } from '../irepositories/purchases'
import { Purchasables } from '../types'

export class PurchasesUseCase {
	repository: IPurchaseRepository

	constructor (repo: IPurchaseRepository) {
		this.repository = repo
	}

	async for (data: { userId: string, type: Purchasables, itemId: string }) {
		const { results } = await this.repository.get({
			where: [
				{ field: 'user.id', value: data.userId },
				{ field: 'data.id', value: data.itemId },
				{ field: 'data.type', value: data.type },
			],
			limit: 1
		})
		return results.at(0) ?? null
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: PurchaseToModel) {
		return await this.repository.create(data)
	}
}