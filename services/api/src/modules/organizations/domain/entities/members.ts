import { BaseEntity } from 'equipped'
import { MemberTypes } from '../types'

export class MemberEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly userId: string | null
	public readonly type: MemberTypes
	public readonly organizationId: string
	public readonly pending: boolean
	public readonly withCode: boolean
	public readonly accepted: { is: boolean, at: number } | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, email, userId, type, organizationId, pending, withCode, accepted, createdAt, updatedAt }: MemberConstructorArgs) {
		super()
		this.id = id
		this.email = email
		this.userId = userId
		this.type = type
		this.organizationId = organizationId
		this.pending = pending
		this.withCode = withCode
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type MemberConstructorArgs = {
	id: string
	email: string
	userId: string | null
	type: MemberTypes
	organizationId: string
	pending: boolean
	withCode: boolean
	accepted: { is: boolean, at: number } | null
	createdAt: number
	updatedAt: number
}