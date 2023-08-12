import { PlayStatus } from '../../domain/types'

export interface TestFromModel extends TestToModel {
	_id: string
	status: PlayStatus
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface TestToModel {
	quizId: string
	participants: string[]
	questions: string[]
}