import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, MemberTypes } from '../types'

export class MemberEntity extends BaseEntity<MemberConstructorArgs> {
	constructor(data: MemberConstructorArgs) {
		data.user = data.user ? generateDefaultUser(data.user) : null
		super(data)
	}
}

type MemberConstructorArgs = {
	id: string
	email: string
	user: EmbeddedUser | null
	type: MemberTypes
	organizationId: string
	pending: boolean
	withCode: boolean
	accepted: { is: boolean; at: number } | null
	createdAt: number
	updatedAt: number
}
