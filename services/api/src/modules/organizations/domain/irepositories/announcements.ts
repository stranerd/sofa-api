import type { QueryParams, QueryResults } from 'equipped'

import type { AnnouncementToModel } from '../../data/models/announcements'
import type { AnnouncementEntity } from '../entities/announcements'
import type { EmbeddedUser } from '../types'

export interface IAnnouncementRepository {
	add: (data: AnnouncementToModel) => Promise<AnnouncementEntity>
	get: (condition: QueryParams) => Promise<QueryResults<AnnouncementEntity>>
	find: (id: string) => Promise<AnnouncementEntity | null>
	update: (organizationId: string, classId: string, id: string, data: Partial<AnnouncementToModel>) => Promise<AnnouncementEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	deleteClassAnnouncements: (organizationId: string, classId: string) => Promise<boolean>
	markRead: (organizationId: string, classId: string, userId: string) => Promise<boolean>
}
