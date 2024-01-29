import { EmbeddedUser, MemberTypes } from '../../domain/types'

export interface MemberFromModel extends MemberToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface MemberToModel {
	pending: boolean
	withCode: boolean
	accepted: { is: boolean; at: number } | null
	organizationId: string
	email: string
	user: EmbeddedUser | null
	type: MemberTypes
}
