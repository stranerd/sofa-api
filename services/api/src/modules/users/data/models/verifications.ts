import { VerificationContent } from '../../domain/types'

export interface VerificationFromModel extends VerificationToModel {
	_id: string
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}

export interface VerificationToModel {
	userId: string
	content: VerificationContent
}