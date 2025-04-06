import type { ClassLesson, ClassMembers, EmbeddedUser, Media, Saleable } from '../../domain/types'

export interface ClassFromModel extends ClassToModel {
	_id: string
	lessons: ClassLesson[]
	members: ClassMembers
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
