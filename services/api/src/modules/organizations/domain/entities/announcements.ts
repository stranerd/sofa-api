import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { AnnouncementFilter, EmbeddedUser } from '../types'

export class AnnouncementEntity extends BaseEntity<AnnouncementConstructorArgs> {
	constructor(data: AnnouncementConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
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
