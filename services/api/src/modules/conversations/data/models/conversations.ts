import { EmbeddedUser } from '../../domain/types'

export interface ConversationFromModel extends ConversationToModel {
	_id: string
	tutor: EmbeddedUser | null
	createdAt: number
	updatedAt: number
}

export interface ConversationToModel {
	title: string
	user: EmbeddedUser
}