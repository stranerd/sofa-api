import type { QueryParams, QueryResults } from 'equipped'

import type { VerificationToModel } from '../../data/models/verifications'
import type { VerificationEntity } from '../entities/verifications'
import type { AcceptVerificationInput } from '../types'

export interface IVerificationRepository {
	find: (id: string) => Promise<VerificationEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<VerificationEntity>>
	create: (data: VerificationToModel) => Promise<VerificationEntity>
	accept: (data: { id: string; data: AcceptVerificationInput }) => Promise<VerificationEntity | null>
}
