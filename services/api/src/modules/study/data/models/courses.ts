import { EmbeddedUser, Media, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Publishable, Saleable {
	title: string
	description: string
	photo: Media | null
	isPublic: boolean
	user: EmbeddedUser
}