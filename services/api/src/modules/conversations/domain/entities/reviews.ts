import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'

export class ReviewEntity extends BaseEntity {
	public readonly id: string
	public readonly conversationId: string
	public readonly to: string
	public readonly user: EmbeddedUser
	public readonly rating: number
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, conversationId, to, user, rating, message, createdAt, updatedAt
	}: ReviewConstructorArgs) {
		super()
		this.id = id
		this.conversationId = conversationId
		this.to = to
		this.user = generateDefaultUser(user)
		this.rating = rating
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReviewConstructorArgs = {
	id: string
	conversationId: string
	to: string
	user: EmbeddedUser
	rating: number
	message: string
	createdAt: number
	updatedAt: number
}