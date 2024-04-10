import { EmbeddedUser, PlayData, PlayScore, PlaySources, PlayStatus, PlayTiming } from '../../domain/types'

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
	title: string
	quizId: string
	user: EmbeddedUser
	totalTimeInSec: number
	timing: PlayTiming
	data: PlayData
	sources: PlaySources
}
