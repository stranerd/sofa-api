import { AuthRoles, AuthTypes, BaseEntity, Enum, MediaOutput } from 'equipped'
import { Phone, UserUpdateInput } from '../types'

export class AuthUserEntity extends BaseEntity<UserConstructorArgs, 'password'> {
	__ignoreInJSON = ['password' as const]

	constructor(data: UserConstructorArgs) {
		data.roles ??= {}
		super(data)
	}

	get allNames() {
		return {
			...this.name,
			full: [this.name.first, this.name.last].join(' ').replaceAll('  ', ' '),
		}
	}

	static bioKeys(): (keyof UserUpdateInput | 'email' | 'phone')[] {
		return ['name', 'email', 'photo', 'description', 'phone']
	}
}

export interface UserConstructorArgs {
	id: string
	email: string
	password: string
	description: string
	roles: AuthRoles
	name: { first: string; last: string }
	photo: MediaOutput | null
	phone: Phone | null
	isEmailVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	lastSignedInAt: number
	signedUpAt: number
}
