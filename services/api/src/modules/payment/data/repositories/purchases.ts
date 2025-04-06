import type { QueryParams } from 'equipped'

import { appInstance } from '@utils/types'

import type { IPurchaseRepository } from '../../domain/irepositories/purchases'
import { PurchaseMapper } from '../mappers/purchases'
import type { PurchaseToModel } from '../models/purchases'
import { Purchase } from '../mongooseModels/purchases'

export class PurchaseRepository implements IPurchaseRepository {
	private static instance: PurchaseRepository
	private mapper: PurchaseMapper

	private constructor() {
		this.mapper = new PurchaseMapper()
	}

	static getInstance() {
		if (!PurchaseRepository.instance) PurchaseRepository.instance = new PurchaseRepository()
		return PurchaseRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Purchase, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async create(data: PurchaseToModel) {
		const purchase = await new Purchase(data).save()
		return this.mapper.mapFrom(purchase)!
	}

	async find(id: string) {
		const purchase = await Purchase.findById(id)
		return this.mapper.mapFrom(purchase)
	}
}
