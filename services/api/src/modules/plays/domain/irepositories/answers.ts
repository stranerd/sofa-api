import { QueryParams, QueryResults } from 'equipped'
import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'
import { PlayTypes } from '../types'

export interface IAnswerRepository {
	answer: (data: AnswerToModel) => Promise<AnswerEntity | null>
	get: (condition: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
	deleteTypeAnswers: (type: PlayTypes, typeId: string) => Promise<boolean>
	end: (data: Omit<AnswerToModel, 'answer' | 'questionId'>) => Promise<AnswerEntity | null>
}
