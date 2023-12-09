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