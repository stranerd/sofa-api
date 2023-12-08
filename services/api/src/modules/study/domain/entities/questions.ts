import { BaseEntity, Validation } from 'equipped'
import stringSimilarity from 'string-similarity'
import { Media, QuestionData, QuestionTypes, StrippedQuestionData } from '../types'

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly quizId: string
	public readonly question: string
	public readonly explanation: string
	public readonly questionMedia: Media | null
	public readonly timeLimit: number
	public readonly data: QuestionData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, quizId, question, explanation, questionMedia, timeLimit, data, createdAt, updatedAt }: QuestionConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.quizId = quizId
		this.question = question
		this.explanation = explanation
		this.questionMedia = questionMedia
		this.timeLimit = timeLimit
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get strippedData () {
		return this.stripAnswers(this.data)
	}

	strip () {
		return {
			...this.toJSON(),
			explanation: '',
			data: this.strippedData,
		}
	}

	private compare (a: string, b: string, quality = 0.95) {
		return stringSimilarity.compareTwoStrings(
			Validation.stripHTML(a).toLowerCase().replaceAll(' ', '').trim(),
			Validation.stripHTML(b).toLowerCase().replaceAll(' ', '').trim()
		) >= quality
	}

	checkAnswer (answer: any): boolean {
		if (this.data.type === QuestionTypes.multipleChoice) {
			return Array.isArray(answer) && Validation.Differ.equal(answer.sort(), this.data.answers.sort())
		} else if (this.data.type === QuestionTypes.trueOrFalse) {
			return answer === this.data.answer
		} else if (this.data.type === QuestionTypes.writeAnswer) {
			return this.data.answers.some((a) => this.compare(a, answer))
		} else if (this.data.type === QuestionTypes.fillInBlanks) {
			const answers = this.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i]))
		} else if (this.data.type === QuestionTypes.dragAnswers) {
			const answers = this.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i], 1))
		} else if (this.data.type === QuestionTypes.sequence) {
			const answers = this.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i], 1))
		} else if (this.data.type === QuestionTypes.match) {
			const questions = this.data.set
			return Array.isArray(answer) &&
				answer.length === questions.length &&
				answer.every((a, i) => this.compare(a, questions[i].a, 1))
		}
		return false
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
				questions: data.set.map(({ q }) => q),
				answers: Validation.shuffleArray(data.set.map(({ a }) => a))
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
	explanation: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
	createdAt: number
	updatedAt: number
}