import type { QueryParams, QueryResults } from 'equipped'

import type { QuestionToModel } from '../../data/models/questions'
import type { QuestionEntity } from '../entities/questions'

export interface IQuestionRepository {
	add: (data: QuestionToModel[]) => Promise<QuestionEntity[]>
	get: (condition: QueryParams) => Promise<QueryResults<QuestionEntity>>
	find: (id: string) => Promise<QuestionEntity | null>
	update: (quizId: string, id: string, userId: string, data: Partial<QuestionToModel>) => Promise<QuestionEntity | null>
	delete: (quizId: string, id: string, userId: string) => Promise<boolean>
	deleteQuizQuestions: (quizId: string) => Promise<boolean>
}
