import { AnnouncementFilter, EmbeddedUser } from '../../domain/types'

export interface AnnouncementFromModel extends AnnouncementToModel {
	_id: string
	readAt: Record<string, number>
	createdAt: number
	updatedAt: number
}

export interface AnnouncementToModel {
	organizationId: string
	classId: string
	filter: AnnouncementFilter
	user: EmbeddedUser
	body: string
}
