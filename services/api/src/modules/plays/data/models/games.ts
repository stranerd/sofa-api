import { EmbeddedUser } from '../../domain/types'

export interface GameFromModel extends GameToModel {
	_id: string
	participants: string[]
	createdAt: number
	updatedAt: number
}

export interface GameToModel {
	quizId: string
	user: EmbeddedUser
	questions: string[]
}