import { BaseEntity } from 'equipped'
import { Media } from '../types'

export class MessageEntity extends BaseEntity<MessageConstructorArgs> {
	constructor(data: MessageConstructorArgs) {
		super(data)
	}
}

type MessageConstructorArgs = {
	id: string
	conversationId: string
	userId: string
	body: string
	media: Media | null
	tags: string[]
	starred: boolean
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
}
