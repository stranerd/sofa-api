import { BaseEntity, Validation } from 'equipped'
import { Media, QuestionData, QuestionTypes, StrippedQuestionData } from '../types'

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

	strip () {
		return structuredClone({
			...this,
			data: this.stripAnswers(this.data)
		})
	}

	private stripAnswers (data: QuestionData): StrippedQuestionData {
		if (data.type === QuestionTypes.multipleChoice) {
			return { type: data.type, options: data.options }
		} else if (data.type === QuestionTypes.trueOrFalse) {
			return { type: data.type }
		} else if (data.type === QuestionTypes.writeAnswer) {
			return { type: data.type }
		} else if (data.type === QuestionTypes.fillInBlanks) {
			return { type: data.type, indicator: data.indicator }
		} else if (data.type === QuestionTypes.dragAnswers) {
			return {
				type: data.type, indicator: data.indicator,
				answers: Validation.shuffleArray(data.answers)
			}
		} else if (data.type === QuestionTypes.sequence) {
			return {
				type: data.type,
				answers: Validation.shuffleArray(data.answers)
			}
		} else if (data.type === QuestionTypes.match) {
			return {
				type: data.type,
				set: data.set.map(({ q }) => ({ q }))
			}
		}
		return data
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