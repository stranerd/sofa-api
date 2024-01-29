import { BaseEntity } from 'equipped'
import { VerificationContent } from '../types'

export class VerificationEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly content: VerificationContent
	public readonly pending: boolean
	public readonly accepted: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, content, pending, accepted, createdAt, updatedAt }: VerificationConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.content = content
		this.pending = pending
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type VerificationConstructorArgs = {
	id: string
	userId: string
	content: VerificationContent
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}
