import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class LikeEntity extends BaseEntity {
	public readonly id: string
	public readonly value: boolean
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, value, entity, user, createdAt, updatedAt }: LikeConstructorArgs) {
		super()
		this.id = id
		this.value = value
		this.entity = entity
		this.user = generateDefaultUser(user)
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type LikeConstructorArgs = {
	id: string
	value: boolean
	entity: InteractionEntity
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}