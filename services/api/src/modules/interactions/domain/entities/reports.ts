import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'
import { generateDefaultUser } from '@modules/users'

export class ReportEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, entity, user, message, createdAt, updatedAt
	             }: ReportConstructorArgs) {
		super()
		this.id = id
		this.entity = entity
		this.user = generateDefaultUser(user)
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReportConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	message: string
	createdAt: number
	updatedAt: number
}
