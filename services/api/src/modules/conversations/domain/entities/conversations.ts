import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'

export class ConversationEntity extends BaseEntity {
	static AI_Id = ''
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

	tags (userId: string) {
		// TODO: add tutor id if there is a tutor
		return this.user.id === userId ? [ConversationEntity.AI_Id] : [this.user.id]
	}
}

type ConversationConstructorArgs = {
	id: string
	title: string
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}