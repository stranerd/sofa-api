import { BaseEntity } from 'equipped'
import { generateDefaultUser } from '@modules/users'
import { EmbeddedUser } from '../types'

export class TutorRequestEntity extends BaseEntity {
	public readonly id: string
	public readonly tutor: EmbeddedUser
	public readonly userId: string
	public readonly conversationId: string
	public readonly pending: boolean
	public readonly accepted: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, tutor, userId, conversationId, pending, accepted, createdAt, updatedAt }: TutorRequestConstructorArgs) {
		super()
		this.id = id
		this.tutor = generateDefaultUser(tutor)
		this.userId = userId
		this.conversationId = conversationId
		this.pending = pending
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TutorRequestConstructorArgs = {
	id: string
	tutor: EmbeddedUser
	userId: string
	conversationId: string
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}