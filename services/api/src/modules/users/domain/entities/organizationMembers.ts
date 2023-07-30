import { BaseEntity } from 'equipped'

export class OrganizationMemberEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly organizationId: string
	public readonly pending: boolean
	public readonly withPassword: boolean
	public readonly accepted: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, email, organizationId, pending, withPassword, accepted, createdAt, updatedAt }: OrganizationMemberConstructorArgs) {
		super()
		this.id = id
		this.email = email
		this.organizationId = organizationId
		this.pending = pending
		this.withPassword = withPassword
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
	withPassword: boolean
	accepted: number | null
	createdAt: number
	updatedAt: number
}