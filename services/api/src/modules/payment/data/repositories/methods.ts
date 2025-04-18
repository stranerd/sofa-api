import type { QueryParams } from 'equipped'
import { BadRequestError } from 'equipped'

import { appInstance } from '@utils/types'

import type { IMethodRepository } from '../../domain/irepositories/methods'
import { MethodMapper } from '../mappers/methods'
import type { MethodToModel } from '../models/methods'
import { Method } from '../mongooseModels/methods'

export class MethodRepository implements IMethodRepository {
	private static instance: MethodRepository
	private mapper: MethodMapper

	private constructor() {
		this.mapper = new MethodMapper()
	}

	static getInstance() {
		if (!MethodRepository.instance) MethodRepository.instance = new MethodRepository()
		return MethodRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Method, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async create(data: MethodToModel) {
		const firstMethod = await Method.findOne({ userId: data.userId, primary: true })
		const method = await Method.findOneAndUpdate(data, { $setOnInsert: data }, { new: true, upsert: true })
		if (!firstMethod) return (await this.makePrimary(method._id, data.userId))!
		return this.mapper.mapFrom(method)!
	}

	async find(id: string) {
		const method = await Method.findById(id)
		return this.mapper.mapFrom(method)
	}

	async makePrimary(id: string, userId: string) {
		let res = null as any
		await Method.collection.conn.transaction(async (session) => {
			await Method.updateMany({ _id: { $ne: id }, userId }, { $set: { primary: false } }, { session })
			const method = await Method.findOneAndUpdate(
				{ _id: id, userId },
				{ $set: { primary: true } },
				{
					session,
					new: true,
				},
			)
			res = method
		})
		return this.mapper.mapFrom(res)
	}

	async markExpireds() {
		const methods = await Method.updateMany(
			{
				'data.expired': false,
				'data.expiredAt': { $lte: Date.now() },
			},
			{ $set: { 'data.expired': true, primary: false } },
		)
		return methods.acknowledged
	}

	async delete(id: string, userId: string) {
		let res = false
		await Method.collection.conn.transaction(async (session) => {
			let method = await Method.findOne({ _id: id, userId, primary: true }, {}, { session })
			if (method) throw new BadRequestError("You can't delete your primary method")
			method = await Method.findOneAndDelete({ _id: id, userId }, { session })
			return (res = !!method)
		})

		return res
	}
}
