export interface TutorRequestFromModel extends TutorRequestToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface TutorRequestToModel {
	pending: boolean
	accepted: boolean
	userId: string
}