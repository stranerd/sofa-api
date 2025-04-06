import type { QueryParams, QueryResults } from 'equipped'

import type { CourseToModel } from '../../data/models/courses'
import type { CourseEntity } from '../entities/courses'

export interface ICourseRepository {
	add: (data: CourseToModel) => Promise<CourseEntity>
	update: (id: string, data: Partial<CourseToModel>) => Promise<CourseEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<CourseEntity>>
	find: (id: string) => Promise<CourseEntity | null>
	delete: (id: string) => Promise<boolean>
	deleteInstitutionCourses: (institutionId: string) => Promise<boolean>
	deleteDepartmentCourses: (departmentId: string) => Promise<boolean>
}
