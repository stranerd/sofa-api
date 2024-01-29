import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'
import { MessageEntity } from './messages'

export class ConversationEntity extends BaseEntity {
	static AI_Id = 'ai-bot'
	public readonly id: string
	public readonly title: string
	public readonly user: EmbeddedUser
	public readonly tutor: EmbeddedUser | null
	public readonly pending: boolean
	public readonly accepted: { is: boolean; at: number } | null
	public readonly ended: { rating: number; message: string; at: number } | null
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly last: MessageEntity | null
	public readonly readAt: Record<string, number>

	constructor({ id, title, user, tutor, pending, accepted, ended, createdAt, updatedAt, last, readAt }: ConversationConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.user = generateDefaultUser(user)
		this.tutor = tutor ? generateDefaultUser(tutor) : null
		this.pending = pending
		this.accepted = accepted
		this.ended = ended
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.last = last
		this.readAt = readAt
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
