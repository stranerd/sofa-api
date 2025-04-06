import type { QueryParams, QueryResults } from 'equipped'

import type { ConnectToModel } from '../../data/models/connects'
import type { ConnectEntity } from '../entities/connects'
import type { EmbeddedUser } from '../types'

export interface IConnectRepository {
	find: (id: string) => Promise<ConnectEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<ConnectEntity>>
	create: (data: ConnectToModel) => Promise<ConnectEntity>
	accept: (data: { id: string; userId: string; accept: boolean }) => Promise<boolean>
	delete: (data: { id: string; userId: string }) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}
