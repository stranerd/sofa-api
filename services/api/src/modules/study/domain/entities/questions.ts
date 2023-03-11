import { BaseEntity } from 'equipped'
import { Media } from '../types'

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly quizId: string
	public readonly question: string
	public readonly questionMedia: Media | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, quizId, question, questionMedia, createdAt, updatedAt }: QuestionConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.quizId = quizId
		this.question = question
		this.questionMedia = questionMedia
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
	createdAt: number
	updatedAt: number
}