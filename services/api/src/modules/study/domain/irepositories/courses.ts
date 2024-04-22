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
	move: (id: string, data: { id: string; type: Coursable }[], add: boolean) => Promise<void>
	updateSections: (id: string, userId: string, sections: CourseSections) => Promise<CourseEntity | null>
	updateMeta: (id: string, property: CourseMeta, value: 1 | -1) => Promise<void>
	updateRatings(id: string, ratings: number, add: boolean): Promise<boolean>
}
