export { Saleable } from '@modules/payment'
export { EmbeddedUser } from '@modules/users'
export { MediaOutput as Media } from 'equipped'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student'
}

export type AnnouncementFilter = {
	lessonId: string | null
	userType: MemberTypes | null
}

export type ScheduleTime = {
	start: number
	end: number
}

export type LessonMembers = {
	students: string[]
	teachers: string[]
}

export enum ScheduleStatus {
	created = 'created',
	started = 'started',
	ended = 'ended'
}

export type ClassLesson = {
	id: string
	title: string
	users: LessonMembers
}

export type ClassMembers = {
	students: string[]
}