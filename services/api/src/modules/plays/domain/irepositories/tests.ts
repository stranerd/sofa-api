import { QueryParams, QueryResults } from 'equipped'
import { TestToModel } from '../../data/models/tests'
import { TestEntity } from '../entities/tests'

export interface ITestRepository {
	add: (data: TestToModel & { totalTimeInSec: number }) => Promise<TestEntity>
	get: (condition: QueryParams) => Promise<QueryResults<TestEntity>>
	find: (id: string) => Promise<TestEntity | null>
	join: (id: string, userId: string, join: boolean) => Promise<TestEntity | null>
	end: (id: string) => Promise<TestEntity | null>
	score: (id: string, scores: Record<string, number>) => Promise<TestEntity | null>
}