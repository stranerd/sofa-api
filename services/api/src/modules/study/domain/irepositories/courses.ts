import { QueryParams, QueryResults } from 'equipped'
import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { Coursable, CourseMeta, CourseSections, EmbeddedUser } from '../types'

export interface ICourseRepository {
	add: (data: CourseToModel) => Promise<CourseEntity>
	get: (condition: QueryParams) => Promise<QueryResults<CourseEntity>>
	find: (id: string) => Promise<CourseEntity | null>
	update: (id: string, userId: string, data: Partial<CourseToModel>) => Promise<CourseEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	publish: (id: string, userId: string) => Promise<CourseEntity | null>
	freeze: (id: string, userId: string) => Promise<CourseEntity | null>
	move: (id: string, coursableId: string, type: Coursable, userId: string, add: boolean) => Promise<CourseEntity | null>
	remove: (id: string, coursableId: string, type: Coursable) => Promise<boolean>
	updateSections: (id: string, userId: string, sections: CourseSections) => Promise<CourseEntity | null>
	updateMeta: (id: string, property: CourseMeta, value: 1 | -1) => Promise<void>
	updateRatings (id: string, ratings: number, add: boolean): Promise<boolean>
}