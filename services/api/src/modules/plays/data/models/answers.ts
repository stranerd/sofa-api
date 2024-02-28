import { PlayAnswer, PlayTypes } from '../../domain/types'

export interface AnswerFromModel extends Omit<AnswerToModel, 'questionId' | 'answer'> {
	_id: string
	type: PlayTypes
	typeId: string
	userId: string
	data: Record<string, { value: PlayAnswer; at: number }>
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	type: PlayTypes
	typeId: string
	userId: string
	questionId: string
	answer: PlayAnswer
}
