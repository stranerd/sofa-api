import { EmbeddedUser } from '../../domain/types'
import { MessageFromModel } from './messages'

export interface ConversationFromModel extends ConversationToModel {
	_id: string
	tutor: EmbeddedUser | null
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
	last: MessageFromModel | null
}

export interface ConversationToModel {
	title: string
	user: EmbeddedUser
}