import { MediaOutput } from 'equipped'
import { VerificationAcceptType } from '../../domain/types'

export interface TutorRequestFromModel extends TutorRequestToModel {
	_id: string
	pending: boolean
	accepted: VerificationAcceptType
	testFinished: boolean
	createdAt: number
	updatedAt: number
}

export interface TutorRequestToModel {
	userId: string
	topicId: string
	testId: string
	verification: MediaOutput
	qualification: MediaOutput[]
}
