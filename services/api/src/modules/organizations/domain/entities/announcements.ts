import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { AnnouncementFilter, EmbeddedUser } from '../types'

export class AnnouncementEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly user: EmbeddedUser
	public readonly body: string
	public readonly filter: AnnouncementFilter
	public readonly readAt: Record<string, number>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, organizationId, classId, user, body, filter, readAt, createdAt, updatedAt }: AnnouncementConstructorArgs) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.user = generateDefaultUser(user)
		this.body = body
		this.filter = filter
		this.readAt = readAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
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
