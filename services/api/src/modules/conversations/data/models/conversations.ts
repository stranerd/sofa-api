import { EmbeddedUser } from '../../domain/types'

export interface ConversationFromModel extends ConversationToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ConversationToModel {
	title: string
	user: EmbeddedUser
}