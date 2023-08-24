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

	async start (input: { id: string, userId: string }) {
		return await this.repository.start(input.id, input.userId)
	}

	async end (input: { id: string, userId: string }) {
		return await this.repository.end(input.id, input.userId)
	}

	async score (data: { id: string, userId: string, scores: Record<string, number> }) {
		return await this.repository.score(data.id, data.userId, data.scores)
	}
}