import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../types'

export class ScheduleEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly lessonId: string
	public readonly user: EmbeddedUser
	public readonly title: string
	public readonly status: ScheduleStatus
	public readonly time: ScheduleTime
	public readonly stream: ScheduleStream | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, organizationId, classId, lessonId, user, title, status, time, stream, createdAt, updatedAt }: ScheduleConstructorArgs) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.lessonId = lessonId
		this.user = generateDefaultUser(user)
		this.title = title
		this.status = status
		this.time = time
		this.stream = stream
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ScheduleConstructorArgs = {
	id: string
	organizationId: string
	classId: string
	lessonId: string
	user: EmbeddedUser
	title: string
	status: ScheduleStatus
	time: ScheduleTime
	stream: ScheduleStream | null
	createdAt: number
	updatedAt: number
}
