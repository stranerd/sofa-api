import { Media } from '../../domain/types'

export interface MessageFromModel extends MessageToModel {
	_id: string
	readAt: Record<string, number>
	createdAt: number
	updatedAt: number
}

export interface MessageToModel {
	conversationId: string
	userId: string
	body: string
	media: Media | null
	tags: string[]
	starred: boolean
}
