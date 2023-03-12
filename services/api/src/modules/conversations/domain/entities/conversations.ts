import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'

export class ConversationEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, user, createdAt, updatedAt }: ConversationConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.user = generateDefaultUser(user)
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ConversationConstructorArgs = {
	id: string
	title: string
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}