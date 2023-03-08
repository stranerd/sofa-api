import { AuthRoles, AuthTypes, BaseEntity, Enum, MediaOutput } from 'equipped'
import { Phone, UserUpdateInput } from '../types'

export class AuthUserEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly password: string
	public readonly description: string
	public readonly firstName: string
	public readonly lastName: string
	public readonly photo: MediaOutput | null
	public readonly phone: Phone | null
	public readonly isVerified: boolean
	public readonly authTypes: Enum<typeof AuthTypes>[]
	public readonly roles: AuthRoles
	public readonly lastSignedInAt: number
	public readonly signedUpAt: number

	constructor (data: UserConstructorArgs) {
		super()
		this.id = data.id
		this.email = data.email
		this.password = data.password
		this.firstName = data.firstName
		this.lastName = data.lastName
		this.description = data.description
		this.photo = data.photo
		this.phone = data.phone
		this.isVerified = data.isVerified
		this.authTypes = data.authTypes
		this.roles = data.roles ?? {}
		this.lastSignedInAt = data.lastSignedInAt
		this.signedUpAt = data.signedUpAt
	}

	get fullName () {
		return [this.firstName, this.lastName].join(' ').replaceAll('  ', ' ')
	}

	static bioKeys (): (keyof UserUpdateInput | 'email' | 'phone')[] {
		return ['firstName', 'lastName', 'email', 'photo', 'description', 'phone']
	}
}

export interface UserConstructorArgs {
	id: string
	email: string
	password: string
	description: string
	roles: AuthRoles
	firstName: string
	lastName: string
	photo: MediaOutput | null
	phone: Phone | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	lastSignedInAt: number
	signedUpAt: number
}