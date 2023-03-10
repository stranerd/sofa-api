import { EmbeddedUser, Publishable } from '../../domain/types'

export interface CardFromModel extends CardToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CardToModel extends Publishable {
	title: string
	user: EmbeddedUser
	set: {
		question: string
		answer: string
	}[]
}