import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'
import { MessageEntity } from './messages'

export class ConversationEntity extends BaseEntity<ConversationConstructorArgs> {
	static AI_Id = 'ai-bot'

	constructor(data: ConversationConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		data.tutor = data.tutor ? generateDefaultUser(data.tutor) : null
		super(data)
	}

	tags(userId: string) {
		return this.user.id === userId ? [this.tutor?.id ?? ConversationEntity.AI_Id] : [this.user.id]
	}
}

type ConversationConstructorArgs = {
	id: string
	title: string
	user: EmbeddedUser
	tutor: EmbeddedUser | null
	pending: boolean
	accepted: { is: boolean; at: number } | null
	ended: { rating: number; message: string; at: number } | null
	createdAt: number
	updatedAt: number
	last: MessageEntity | null
	readAt: Record<string, number>
}
