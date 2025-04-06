import type { QueryParams } from 'equipped'

import { appInstance } from '@utils/types'

import type { IPlanRepository } from '../../domain/irepositories/plans'
import { PlanMapper } from '../mappers/plans'
import type { PlanToModel } from '../models/plans'
import { Plan } from '../mongooseModels/plans'

export class PlanRepository implements IPlanRepository {
	private static instance: PlanRepository
	private mapper: PlanMapper

	private constructor() {
		this.mapper = new PlanMapper()
	}

	static getInstance() {
		if (!PlanRepository.instance) PlanRepository.instance = new PlanRepository()
		return PlanRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Plan, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async init(data: PlanToModel[]) {
		await Plan.deleteMany({ _id: { $nin: data.map((d) => d._id) } })
		return await Promise.all(
			data.map(async (d) => {
				const sub = await Plan.findByIdAndUpdate(d._id, { $set: d }, { new: true, upsert: true })
				return this.mapper.mapFrom(sub)!
			}),
		)
	}

	async find(id: string) {
		const plan = await Plan.findById(id)
		return this.mapper.mapFrom(plan)
	}
}
