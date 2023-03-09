import { QueryParams, QueryResults } from 'equipped'
import { TagToModel } from '../../data/models/tags'
import { TagEntity } from '../entities/tags'

export interface ITagRepository {
	add: (data: TagToModel) => Promise<TagEntity>
	get: (query: QueryParams) => Promise<QueryResults<TagEntity>>
	find: (id: string) => Promise<TagEntity | null>
	update: (id: string, data: Partial<TagToModel>) => Promise<TagEntity | null>
	delete: (id: string) => Promise<boolean>
}