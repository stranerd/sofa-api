import { QueryParams, QueryResults } from 'equipped'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../entities/tutorRequests'
import { EmbeddedUser } from '../types'

export interface ITutorRequestRepository {
	find: (id: string) => Promise<TutorRequestEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<TutorRequestEntity>>
	create: (data: TutorRequestToModel) => Promise<TutorRequestEntity>
	accept: (data: { id: string, tutorId: string, accept: boolean }) => Promise<boolean>
	delete: (data: { id: string }) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
}