import type { QueryParams, QueryResults } from 'equipped'

import type { ScheduleToModel } from '../../data/models/schedules'
import type { ScheduleEntity } from '../entities/schedules'
import type { EmbeddedUser } from '../types'

export interface IScheduleRepository {
	add: (data: ScheduleToModel) => Promise<ScheduleEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ScheduleEntity>>
	find: (id: string) => Promise<ScheduleEntity | null>
	update: (
		organizationId: string,
		classId: string,
		id: string,
		data: Partial<ScheduleToModel>,
		lessons: string[] | undefined,
	) => Promise<ScheduleEntity | null>
	delete: (organizationId: string, classId: string, id: string, lessons: string[] | undefined) => Promise<boolean>
	start: (organizationId: string, classId: string, id: string, lessons: string[] | undefined) => Promise<ScheduleEntity | null>
	end: (organizationId: string, classId: string, id: string, lessons: string[] | undefined) => Promise<ScheduleEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	deleteLessonSchedules: (organizationId: string, classId: string, lessonId: string) => Promise<boolean>
}
