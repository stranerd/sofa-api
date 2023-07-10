import { BaseEntity } from 'equipped'

export class TutorRequestEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly pending: boolean
	public readonly accepted: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, pending, accepted, createdAt, updatedAt }: TutorRequestConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.pending = pending
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TutorRequestConstructorArgs = {
	id: string
	userId: string
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}