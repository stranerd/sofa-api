import { PlayTypes } from '../../domain/types'

export interface AnswerFromModel extends AnswerToModel {
	_id: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	type: PlayTypes
	typeId: string
	userId: string
}