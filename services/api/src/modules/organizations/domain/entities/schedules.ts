import { BaseEntity } from 'equipped'

import { generateDefaultUser } from '@modules/users'

import type { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../types'

export class ScheduleEntity extends BaseEntity<ScheduleConstructorArgs> {
	constructor(data: ScheduleConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type ScheduleConstructorArgs = {
	id: string
	organizationId: string
	classId: string
	lessonId: string
	user: EmbeddedUser
	title: string
	description: string
	status: ScheduleStatus
	time: ScheduleTime
	stream: ScheduleStream | null
	createdAt: number
	updatedAt: number
}
