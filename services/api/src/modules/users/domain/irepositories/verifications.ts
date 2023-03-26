import { QueryParams, QueryResults } from 'equipped'
import { VerificationToModel } from '../../data/models/verifications'
import { VerificationEntity } from '../entities/verifications'

export interface IVerificationRepository {
	find: (id: string) => Promise<VerificationEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<VerificationEntity>>
	create: (data: VerificationToModel) => Promise<VerificationEntity>
	accept: (data: { id: string, accept: boolean }) => Promise<boolean>
}