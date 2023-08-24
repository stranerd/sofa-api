import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ITestRepository } from '../../domain/irepositories/tests'
import { PlayStatus } from '../../domain/types'
import { TestMapper } from '../mappers/tests'
import { TestToModel } from '../models/tests'
import { Test } from '../mongooseModels/tests'

export class TestRepository implements ITestRepository {
	private static instance: TestRepository
	private mapper: TestMapper

	private constructor () {
		this.mapper = new TestMapper()
	}

	static getInstance () {
		if (!TestRepository.instance) TestRepository.instance = new TestRepository()
		return TestRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Test, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: TestToModel & { totalTimeInSec: number }) {
		const test = await new Test({ ...data, status: PlayStatus.created }).save()
		return this.mapper.mapFrom(test)!
	}

	async start (id: string, userId: string) {
		const test = await Test.findOneAndUpdate(
			{ _id: id, userId, status: PlayStatus.created },
			{ $set: { startedAt: Date.now(), status: PlayStatus.started } },
			{ new: true })
		return this.mapper.mapFrom(test)
	}

	async find (id: string) {
		const test = await Test.findById(id)
		return this.mapper.mapFrom(test)
	}

	async end (id: string, userId: string) {
		const test = await Test.findOneAndUpdate(
			{ _id: id, userId, status: PlayStatus.started },
			{ $set: { endedAt: Date.now(), status: PlayStatus.ended } }, { new: true })
		return this.mapper.mapFrom(test)
	}

	async score (id: string, userId: string, scores: Record<string, number>) {
		const test = await Test.findOneAndUpdate(
			{ _id: id, userId, status: PlayStatus.ended },
			{ $set: { scores, status: PlayStatus.scored } }, { new: true })
		return this.mapper.mapFrom(test)
	}
}