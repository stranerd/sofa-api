import { QueryParams, QueryResults } from 'equipped'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'
import { ClassLesson, ClassMembers, EmbeddedUser, LessonMembers } from '../types'

export interface IClassRepository {
	add: (data: ClassToModel) => Promise<ClassEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	find: (id: string) => Promise<ClassEntity | null>
	update: (organizationId: string, id: string, data: Partial<ClassToModel>) => Promise<ClassEntity | null>
	delete: (organizationId: string, id: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	addLesson: (organizationId: string, classId: string, data: Partial<ClassLesson>) => Promise<ClassEntity | null>
	updateLesson: (organizationId: string, classId: string, lessonId: string, data: Partial<ClassLesson>) => Promise<ClassEntity | null>
	deleteLesson: (organizationId: string, classId: string, lessonId: string) => Promise<ClassEntity | null>
	manageMembers: (data: {
		organizationId: string
		classId: string
		userIds: string[]
		type: keyof ClassMembers
		add: boolean
	}) => Promise<ClassEntity | null>
	manageLessonUsers: (data: {
		organizationId: string
		classId: string
		lessonId: string
		userIds: string[]
		type: keyof LessonMembers
		add: boolean
	}) => Promise<ClassEntity | null>
	updateLessonCurriculum: (data: {
		organizationId: string
		classId: string
		lessonId: string
		curriculum: ClassLesson['curriculum']
	}) => Promise<ClassEntity | null>
}
