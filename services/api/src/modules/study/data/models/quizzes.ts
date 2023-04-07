import { CoursableData, QuizMetaType } from '../../domain/types'

export interface QuizFromModel extends QuizToModel {
	_id: string
	questions: string[]
	meta: Record<QuizMetaType, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends CoursableData { }