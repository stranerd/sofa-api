import { QueryParams, QueryResults } from 'equipped'
import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'

export interface IAnswerRepository {
	answer: (data: AnswerToModel & { questionId: string, answer: any }) => Promise<AnswerEntity | null>
	get: (condition: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
	deleteGameAnswers: (answerId: string) => Promise<boolean>
}