import { Media, QuestionData } from '../../domain/types'

export interface QuestionFromModel extends QuestionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	userId: string
	quizId: string
	question: string
	explanation: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
	isAiGenerated: boolean
}
