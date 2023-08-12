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
		const startedAt = Date.now()
		const endedAt = startedAt + (data.totalTimeInSec + 5) * 1000
		const test = await new Test({
			...data,
			startedAt, endedAt, status: PlayStatus.started
		}).save()
		return this.mapper.mapFrom(test)!
	}

	async find (id: string) {
		const test = await Test.findById(id)
		return this.mapper.mapFrom(test)
	}

	async join (id: string, userId: string, join: boolean) {
		const test = await Test.findOneAndUpdate({
			_id: id, status: PlayStatus.created
		}, {
			[join ? '$addToSet' : '$pull']: { 'participants': userId }
		}, { new: true })
		return this.mapper.mapFrom(test)
	}

	async end (id: string) {
		const test = await Test.findOneAndUpdate(
			{ _id: id, status: PlayStatus.started },
			{ $set: { status: PlayStatus.ended } }, { new: true })
		return this.mapper.mapFrom(test)
	}

	async score (id: string, scores: Record<string, number>) {
		const test = await Test.findOneAndUpdate(
			{ _id: id, status: PlayStatus.ended },
			{ $set: { scores, status: PlayStatus.scored } }, { new: true })
		return this.mapper.mapFrom(test)
	}
}