import { EmbeddedUser, PlayData, PlayScore, PlayStatus } from '../../domain/types'

export interface PlayFromModel extends PlayToModel {
	_id: string
	status: PlayStatus
	scores: PlayScore
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface PlayToModel {
	quizId: string
	user: EmbeddedUser
	questions: string[]
	totalTimeInSec: number
	data: PlayData
}
