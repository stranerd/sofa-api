import { EmbeddedUser, GameStatus } from '../../domain/types'

export interface GameFromModel extends GameToModel {
	_id: string
	status: GameStatus
	participants: string[]
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface GameToModel {
	quizId: string
	user: EmbeddedUser
	questions: string[]
}