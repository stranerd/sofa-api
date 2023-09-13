import { QueryParams, QueryResults } from 'equipped'
import { FileToModel } from '../../data/models/files'
import { FileEntity } from '../entities/files'
import { EmbeddedUser } from '../types'

export interface IFileRepository {
	add: (data: FileToModel) => Promise<FileEntity>
	get: (condition: QueryParams) => Promise<QueryResults<FileEntity>>
	find: (id: string) => Promise<FileEntity | null>
	update: (id: string, userId: string, data: Partial<FileToModel>) => Promise<FileEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	publish: (id: string, userId: string) => Promise<FileEntity | null>
	updateRatings (id: string, ratings: number, add: boolean): Promise<boolean>
}