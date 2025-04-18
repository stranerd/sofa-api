import type { CoursableData, QuizAccess, QuizMeta, QuizModes } from '../../domain/types'

export interface QuizFromModel extends QuizToModel, CoursableData {
	_id: string
	questions: string[]
	access: QuizAccess
	ratings: CoursableData['ratings']
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Omit<CoursableData, 'ratings' | 'courseIds'> {
	isForTutors: boolean
	modes: Record<QuizModes, boolean>
	timeLimit: number | null
}
