import { BaseEntity } from 'equipped'

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly quizId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, quizId, createdAt, updatedAt }: QuestionConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.quizId = quizId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type QuestionConstructorArgs = {
	id: string
	userId: string
	quizId: string
	createdAt: number
	updatedAt: number
}