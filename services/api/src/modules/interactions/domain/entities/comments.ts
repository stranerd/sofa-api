import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CommentMetaType, EmbeddedUser, InteractionEntity } from '../types'

export class CommentEntity extends BaseEntity {
	public readonly id: string
	public readonly body: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly meta: CommentMetaType
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, body, entity, user, meta, createdAt, updatedAt }: CommentConstructorArgs) {
		super()
		this.id = id
		this.body = body
		this.entity = entity
		this.user = generateDefaultUser(user)
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type CommentConstructorArgs = {
	id: string
	body: string
	entity: InteractionEntity
	user: EmbeddedUser
	meta: CommentMetaType
	createdAt: number
	updatedAt: number
}
