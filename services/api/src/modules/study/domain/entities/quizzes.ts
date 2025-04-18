import type { CoursableData, QuizAccess, QuizMeta, QuizModes } from '../types'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity<QuizConstructorArgs> implements CoursableData {
	constructor(data: QuizConstructorArgs) {
		super(data)
	}

	canUserAccess(userId: string) {
		return this.user.id === userId || this.access.members.includes(userId)
	}
}

type QuizConstructorArgs = CoursableData & {
	id: string
	questions: string[]
	meta: Record<QuizMeta, number>
	access: QuizAccess
	isForTutors: boolean
	modes: Record<QuizModes, boolean>
	timeLimit: number | null
	createdAt: number
	updatedAt: number
}
