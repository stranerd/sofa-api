import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class ReviewEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly rating: number
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, entity, user, rating, message, createdAt, updatedAt
	}: ReviewConstructorArgs) {
		super()
		this.id = id
		this.entity = entity
		this.user = generateDefaultUser(user)
		this.rating = rating
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReviewConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	rating: number
	message: string
	createdAt: number
	updatedAt: number
}