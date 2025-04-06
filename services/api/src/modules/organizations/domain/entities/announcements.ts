import { BaseEntity } from 'equipped'

import { generateDefaultUser } from '@modules/users'

import type { AnnouncementFilter, EmbeddedUser } from '../types'
import { MemberTypes } from '../types'
import type { ClassEntity } from './classes'

export class AnnouncementEntity extends BaseEntity<AnnouncementConstructorArgs> {
	constructor(data: AnnouncementConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	getRecipients(classInst: ClassEntity) {
		const filterLessons = this.filter.lessonIds
		const lessons = filterLessons ? classInst.lessons.filter((lesson) => filterLessons.includes(lesson.id)) : classInst.lessons
		const recipients = lessons.reduce((acc, lesson) => {
			const filterUserTypes = this.filter.userTypes
			if (!filterUserTypes || filterUserTypes.includes(MemberTypes.student)) acc.push(...lesson.users.students)
			if (!filterUserTypes || filterUserTypes.includes(MemberTypes.teacher)) acc.push(...lesson.users.teachers)
			if (!filterUserTypes) acc.push(classInst.user.id)
			return acc
		}, [] as string[])
		return [...new Set(recipients)].filter((id) => this.user.id !== id)
	}
}

type AnnouncementConstructorArgs = {
	id: string
	organizationId: string
	classId: string
	filter: AnnouncementFilter
	user: EmbeddedUser
	body: string
	readAt: Record<string, number>
	createdAt: number
	updatedAt: number
}
