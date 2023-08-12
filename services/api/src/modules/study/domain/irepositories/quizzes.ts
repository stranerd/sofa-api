import { QueryParams, QueryResults } from 'equipped'
import { QuizToModel } from '../../data/models/quizzes'
import { QuizEntity } from '../entities/quizzes'
import { EmbeddedUser, QuizMeta } from '../types'

export interface IQuizRepository {
	add: (data: QuizToModel) => Promise<QuizEntity>
	get: (condition: QueryParams) => Promise<QueryResults<QuizEntity>>
	find: (id: string) => Promise<QuizEntity | null>
	update: (id: string, userId: string, data: Partial<QuizToModel>) => Promise<QuizEntity | null>
	delete: (id: string, userId: string, isAdmin: boolean) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	publish: (id: string, userId: string) => Promise<QuizEntity | null>
	toggleQuestion: (id: string, userId: string, questionId: string, add: boolean) => Promise<QuizEntity | null>
	reorder: (id: string, userId: string, questionIds: string[]) => Promise<QuizEntity | null>
	deleteCourseQuizzes: (courseId: string) => Promise<boolean>
	updateMeta: (id: string, property: QuizMeta, value: 1 | -1) => Promise<void>
}