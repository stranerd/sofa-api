import type { QueryParams, QueryResults } from 'equipped'

import type { FileToModel } from '../../data/models/files'
import type { FileEntity } from '../entities/files'
import type { EmbeddedUser } from '../types'

export interface IFileRepository {
	add: (data: FileToModel) => Promise<FileEntity>
	get: (condition: QueryParams) => Promise<QueryResults<FileEntity>>
	find: (id: string) => Promise<FileEntity | null>
	update: (id: string, userId: string, data: Partial<FileToModel>) => Promise<FileEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	publish: (id: string, userId: string) => Promise<FileEntity | null>
	updateRatings(id: string, ratings: number, add: boolean): Promise<boolean>
}
