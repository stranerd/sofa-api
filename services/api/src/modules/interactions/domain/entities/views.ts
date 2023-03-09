import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class ViewEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, entity, user, createdAt, updatedAt }: ViewConstructorArgs) {
		super()
		this.id = id
		this.entity = entity
		this.user = generateDefaultUser(user)
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ViewConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}