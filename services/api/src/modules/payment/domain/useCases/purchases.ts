import { QueryParams } from 'equipped'
import { PurchaseToModel } from '../../data/models/purchases'
import { IPurchaseRepository } from '../irepositories/purchases'

export class PurchasesUseCase {
	repository: IPurchaseRepository

	constructor (repo: IPurchaseRepository) {
		this.repository = repo
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