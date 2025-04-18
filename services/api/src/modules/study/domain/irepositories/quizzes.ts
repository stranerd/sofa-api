import type { QueryParams, QueryResults } from 'equipped'

import type { QuizToModel } from '../../data/models/quizzes'
import type { QuizEntity } from '../entities/quizzes'
import type { EmbeddedUser, QuizMeta } from '../types'

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
	updateMeta: (id: string, property: QuizMeta, value: 1 | -1) => Promise<void>
	updateRatings(id: string, ratings: number, add: boolean): Promise<boolean>
	requestAccess(id: string, userId: string, add: boolean): Promise<boolean>
	grantAccess(id: string, ownerId: string, userId: string, grant: boolean): Promise<boolean>
	addMembers(id: string, ownerId: string, userIds: string[], grant: boolean): Promise<boolean>
}
