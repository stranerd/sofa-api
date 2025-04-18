import type { MessageFromModel } from './messages'
import type { EmbeddedUser } from '../../domain/types'

export interface ConversationFromModel extends ConversationToModel {
	_id: string
	ended: { rating: number; message: string; at: number } | null
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
	last: MessageFromModel | null
}

export interface ConversationToModel {
	title: string
	user: EmbeddedUser
	tutor: EmbeddedUser | null
	pending: boolean
	accepted: { is: boolean; at: number } | null
}
