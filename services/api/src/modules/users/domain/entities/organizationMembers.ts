import { BaseEntity } from 'equipped'

export class OrganizationMemberEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly organizationId: string
	public readonly pending: boolean
	public readonly withCode: boolean
	public readonly accepted: { is: boolean, at: number } | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, email, organizationId, pending, withCode, accepted, createdAt, updatedAt }: OrganizationMemberConstructorArgs) {
		super()
		this.id = id
		this.email = email
		this.organizationId = organizationId
		this.pending = pending
		this.withCode = withCode
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type OrganizationMemberConstructorArgs = {
	id: string
	email: string
	organizationId: string
	pending: boolean
	withCode: boolean
	accepted: { is: boolean, at: number } | null
	createdAt: number
	updatedAt: number
}