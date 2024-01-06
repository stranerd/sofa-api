import { EmbeddedUser, ScheduleStatus, ScheduleTime } from '../../domain/types'

export interface ScheduleFromModel extends ScheduleToModel {
	_id: string
	status: ScheduleStatus
	createdAt: number
	updatedAt: number
}

export interface ScheduleToModel {
	organizationId: string
	classId: string
	lessonId: string
	user: EmbeddedUser
	title: string
	time: ScheduleTime
}