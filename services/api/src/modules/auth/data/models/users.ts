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
	firstName: string
	lastName: string
	photo: MediaOutput | null
	phone: Phone | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
}