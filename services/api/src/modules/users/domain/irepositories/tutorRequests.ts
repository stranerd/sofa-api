import { QueryParams, QueryResults } from 'equipped'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../entities/tutorRequests'
import { AcceptVerificationInput } from '../types'

export interface ITutorRequestRepository {
	find: (id: string) => Promise<TutorRequestEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<TutorRequestEntity>>
	create: (data: TutorRequestToModel) => Promise<TutorRequestEntity>
	accept: (data: { id: string; data: AcceptVerificationInput }) => Promise<TutorRequestEntity | null>
	markTestFinished: (testId: string) => Promise<boolean>
}
