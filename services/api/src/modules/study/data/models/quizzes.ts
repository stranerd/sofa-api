import { CoursableData, QuizMeta } from '../../domain/types'

export interface QuizFromModel extends QuizToModel {
	_id: string
	questions: string[]
	ratings: CoursableData['ratings']
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Omit<CoursableData, 'ratings'> {
	isForTutors: boolean
}