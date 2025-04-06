import type { QueryParams, QueryResults } from 'equipped'

import type { FolderToModel } from '../../data/models/folders'
import type { FolderEntity } from '../entities/folders'
import type { EmbeddedUser, FolderSaved } from '../types'

export interface IFolderRepository {
	add: (data: FolderToModel) => Promise<FolderEntity>
	get: (condition: QueryParams) => Promise<QueryResults<FolderEntity>>
	find: (id: string) => Promise<FolderEntity | null>
	update: (id: string, userId: string, data: Partial<FolderToModel>) => Promise<FolderEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updateProp: (id: string, userId: string, prop: FolderSaved, add: boolean, values: string[]) => Promise<FolderEntity | null>
	removeProp: (prop: FolderSaved, value: string) => Promise<boolean>
}
