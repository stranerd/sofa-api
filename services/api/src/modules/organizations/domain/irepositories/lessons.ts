import { QueryParams, QueryResults } from 'equipped'
import { LessonToModel } from '../../data/models/lessons'
import { LessonEntity } from '../entities/lessons'
import { LessonMembers } from '../types'

export interface ILessonRepository {
	add: (data: LessonToModel) => Promise<LessonEntity>
	get: (condition: QueryParams) => Promise<QueryResults<LessonEntity>>
	find: (id: string) => Promise<LessonEntity | null>
	update: (organizationId: string, classId: string, id: string, data: Partial<LessonToModel>) => Promise<LessonEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
	deleteClassLessons: (organizationId: string, classId: string) => Promise<boolean>
	manageUsers: (data: { organizationId: string, classId: string, id: string, userIds: string[], type: keyof LessonMembers, add: boolean }) => Promise<LessonEntity | null>
}