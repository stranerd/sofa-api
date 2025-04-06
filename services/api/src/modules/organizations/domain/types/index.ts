import type { CourseSections } from '@modules/study'

export type { Saleable } from '@modules/payment'
export type { EmbeddedUser } from '@modules/users'
export type { MediaOutput as Media } from 'equipped'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student',
}

export type AnnouncementFilter = {
	lessonIds: string[] | null
	userTypes: MemberTypes[] | null
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
	ended = 'ended',
}

export type ClassLesson = {
	id: string
	title: string
	users: LessonMembers
	curriculum: CourseSections
}

export type ClassLessonInput = {
	title: string
	teachers: string[]
}

export type ClassMembers = {
	students: string[]
}

export type ScheduleStream = {
	broadcastId: string
	streamId: string
	streamKey: string
	type: 'jitsi'
	roomId: string
	canRewatch: boolean
}
