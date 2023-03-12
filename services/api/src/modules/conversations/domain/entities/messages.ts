import { BaseEntity } from 'equipped'
import { Media } from '../types'

export class MessageEntity extends BaseEntity {
	public readonly id: string
	public readonly conversationId: string
	public readonly userId: string
	public readonly body: string
	public readonly media: Media | null
	public readonly tags: string[]
	public readonly starred: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, conversationId, userId, body, media, tags, starred, createdAt, updatedAt }: MessageConstructorArgs) {
		super()
		this.id = id
		this.conversationId = conversationId
		this.userId = userId
		this.body = body
		this.media = media
		this.tags = tags
		this.starred = starred
		this.createdAt = createdAt
		this.updatedAt = updatedAt
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
}