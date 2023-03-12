import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'

export class ConversationEntity extends BaseEntity {
	static AI_Id = ''
	public readonly id: string
	public readonly title: string
	public readonly user: EmbeddedUser
	public readonly tutor: EmbeddedUser | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, user, tutor, createdAt, updatedAt }: ConversationConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.user = generateDefaultUser(user)
		this.tutor = tutor ? generateDefaultUser(tutor) : null
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	tags (userId: string) {
		return this.user.id === userId ? [this.tutor?.id ?? ConversationEntity.AI_Id] : [this.user.id]
	}
}

type ConversationConstructorArgs = {
	id: string
	title: string
	user: EmbeddedUser
	tutor: EmbeddedUser | null
	createdAt: number
	updatedAt: number
}