import { CoursableData, QuizAccess, QuizMeta, QuizModes } from '../types'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity implements CoursableData {
	public readonly questions: string[]
	public readonly meta: Record<QuizMeta, number>
	public readonly access: QuizAccess
	public readonly isForTutors: boolean
	public readonly modes: Record<QuizModes, boolean>

	constructor(data: QuizConstructorArgs) {
		super(data)
		this.questions = data.questions
		this.meta = data.meta
		this.access = data.access
		this.isForTutors = data.isForTutors
		this.modes = data.modes
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
	createdAt: number
	updatedAt: number
}
