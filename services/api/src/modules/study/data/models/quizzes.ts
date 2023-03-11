import { EmbeddedUser, Publishable } from '../../domain/types'

export interface QuizFromModel extends QuizToModel {
	_id: string
	questions: string[]
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Publishable {
	title: string
	user: EmbeddedUser
}