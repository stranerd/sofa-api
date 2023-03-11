import { EmbeddedUser, Media, Publishable } from '../../domain/types'

export interface QuizFromModel extends QuizToModel {
	_id: string
	questions: string[]
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Publishable {
	title: string
	description: string
	photo: Media | null
	isPublic: boolean
	user: EmbeddedUser
}