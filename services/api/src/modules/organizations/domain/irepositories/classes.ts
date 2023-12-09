import { QueryParams, QueryResults } from 'equipped'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'
import { EmbeddedUser } from '../types'

export interface IClassRepository {
	add: (data: ClassToModel) => Promise<ClassEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	find: (id: string) => Promise<ClassEntity | null>
	update: (id: string, userId: string, data: Partial<ClassToModel>) => Promise<ClassEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}