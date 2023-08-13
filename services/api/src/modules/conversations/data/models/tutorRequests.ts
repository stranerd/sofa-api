import { EmbeddedUser } from '../../domain/types'

export interface TutorRequestFromModel extends TutorRequestToModel {
	_id: string
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}

export interface TutorRequestToModel {
	tutor: EmbeddedUser
	conversationId: string
}