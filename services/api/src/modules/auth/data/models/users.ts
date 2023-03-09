import { AuthRoles, AuthTypes, Enum, MediaOutput } from 'equipped'
import { Phone } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
	roles: AuthRoles
	signedUpAt: number
	lastSignedInAt: number
}

export interface UserToModel {
	email: string
	password: string
	description: string
	name: { first: string, last: string }
	photo: MediaOutput | null
	phone: Phone | null
	isEmailVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
}