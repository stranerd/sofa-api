import { QueryParams, QueryResults } from 'equipped'
import { TestToModel } from '../../data/models/tests'
import { TestEntity } from '../entities/tests'
import { EmbeddedUser } from '../types'

export interface ITestRepository {
	add: (data: TestToModel) => Promise<TestEntity>
	get: (condition: QueryParams) => Promise<QueryResults<TestEntity>>
	find: (id: string) => Promise<TestEntity | null>
	start: (id: string, userId: string) => Promise<TestEntity | null>
	end: (id: string, userId: string) => Promise<TestEntity | null>
	score: (id: string, userId: string, scores: Record<string, number>) => Promise<TestEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}
