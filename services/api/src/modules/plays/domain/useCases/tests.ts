import { QueryParams } from 'equipped'
import { TestToModel } from '../../data/models/tests'
import { ITestRepository } from '../irepositories/tests'

export class TestsUseCase {
	private repository: ITestRepository

	constructor (repository: ITestRepository) {
		this.repository = repository
	}

	async add (data: TestToModel & { totalTimeInSec: number }) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async join (data: { id: string, userId: string, join: boolean }) {
		return await this.repository.join(data.id, data.userId, data.join)
	}

	async end (input: { id: string }) {
		return await this.repository.end(input.id)
	}

	async score (data: { id: string, scores: Record<string, number> }) {
		return await this.repository.score(data.id, data.scores)
	}
}