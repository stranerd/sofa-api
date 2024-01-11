import { ClassLesson, EmbeddedUser, Media, Saleable } from '../../domain/types'

export interface ClassFromModel extends ClassToModel {
	_id: string
	lessons: ClassLesson[]
	createdAt: number
	updatedAt: number
}

export interface ClassToModel extends Saleable {
	organizationId: string
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
}