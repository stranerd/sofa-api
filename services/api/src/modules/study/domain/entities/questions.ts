import { BaseEntity } from 'equipped'
import { Media, QuestionData } from '../types'

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly quizId: string
	public readonly question: string
	public readonly questionMedia: Media | null
	public readonly timeLimit: number
	public readonly data: QuestionData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, quizId, question, questionMedia, timeLimit, data, createdAt, updatedAt }: QuestionConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.quizId = quizId
		this.question = question
		this.questionMedia = questionMedia
		this.timeLimit = timeLimit
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type QuestionConstructorArgs = {
	id: string
	userId: string
	quizId: string
	question: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
	createdAt: number
	updatedAt: number
}