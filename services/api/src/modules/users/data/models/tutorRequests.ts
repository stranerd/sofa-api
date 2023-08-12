import { MediaOutput } from 'equipped'

export interface TutorRequestFromModel extends TutorRequestToModel {
	_id: string
	pending: boolean
	accepted: boolean
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