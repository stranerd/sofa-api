import { CoursableData, QuizAccess, QuizMeta, QuizModes, QuizQuestions } from '../types'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity<QuizConstructorArgs> implements CoursableData {
	constructor(data: QuizConstructorArgs) {
		super(data)
	}

	canUserAccess(userId: string) {
		return this.user.id === userId || this.access.members.includes(userId)
	}

	getQuestionIds() {
		return this.questions.flatMap((s) => s.items)
	}
}

type QuizConstructorArgs = CoursableData & {
	id: string
	questions: QuizQuestions
	meta: Record<QuizMeta, number>
	access: QuizAccess
	isForTutors: boolean
	modes: Record<QuizModes, boolean>
	timeLimit: number | null
	createdAt: number
	updatedAt: number
}
