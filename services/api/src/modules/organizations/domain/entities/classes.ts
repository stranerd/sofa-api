import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { ClassLesson, ClassMembers, EmbeddedUser, Media, Saleable } from '../types'

export class ClassEntity extends BaseEntity<ClassConstructorArgs> implements Saleable {
	constructor(data: ClassConstructorArgs) {
		super({
			...data,
			user: generateDefaultUser(data.user),
			lessons: data.lessons.map((l) => ({
				id: l.id,
				title: l.title,
				users: l.users ?? { students: [], teachers: [] },
				curriculum: l.curriculum ?? [],
			})),
		})
	}

	getLesson(id: string) {
		return this.lessons.find((l) => l.id === id) ?? null
	}
}

type ClassConstructorArgs = Saleable & {
	id: string
	organizationId: string
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	lessons: ClassLesson[]
	members: ClassMembers
	createdAt: number
	updatedAt: number
}
