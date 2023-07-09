import { VerificationContent } from '../../domain/types'

export interface VerificationFromModel extends VerificationToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface VerificationToModel {
	pending: boolean
	accepted: boolean
	userId: string
	content: VerificationContent
}