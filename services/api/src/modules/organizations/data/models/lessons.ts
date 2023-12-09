import { LessonMembers } from '../../domain/types'

export interface LessonFromModel extends LessonToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface LessonToModel {
	organizationId: string
	classId: string
	title: string
	users: LessonMembers
}