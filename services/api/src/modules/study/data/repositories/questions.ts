import type { QueryParams } from 'equipped'
import { BadRequestError } from 'equipped'

import { DraftStatus } from '@modules/study'
import { appInstance } from '@utils/types'

import type { IQuestionRepository } from '../../domain/irepositories/questions'
import { QuestionMapper } from '../mappers/questions'
import type { QuestionFromModel, QuestionToModel } from '../models/questions'
import { Question } from '../mongooseModels/questions'
import { Quiz } from '../mongooseModels/quizzes'

export class QuestionRepository implements IQuestionRepository {
	private static instance: QuestionRepository
	private mapper: QuestionMapper

	private constructor() {
		this.mapper = new QuestionMapper()
	}

	static getInstance() {
		if (!QuestionRepository.instance) QuestionRepository.instance = new QuestionRepository()
		return QuestionRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Question, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: QuestionToModel[]) {
		return Promise.all(data.map(async (d) => this.mapper.mapFrom(await new Question(d).save())!))
	}

	async find(id: string) {
		const question = await Question.findById(id)
		return this.mapper.mapFrom(question)
	}

	async update(quizId: string, id: string, userId: string, data: Partial<QuestionToModel>) {
		let res = null as QuestionFromModel | null
		await Question.collection.conn.transaction(async (session) => {
			const quiz = await Quiz.findById(quizId, {}, { session })
			if (!quiz || !quiz.access.members.concat(quiz.user.id).includes(userId)) return
			const question = await Question.findOneAndUpdate({ _id: id, quizId }, { $set: data }, { new: true })
			res = question
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async delete(quizId: string, id: string, userId: string) {
		let res = false
		await Question.collection.conn.transaction(async (session) => {
			const quiz = await Quiz.findById(quizId, {}, { session })
			if (!quiz || !quiz.access.members.concat(quiz.user.id).includes(userId)) return false
			if (quiz.status !== DraftStatus.draft) throw new BadRequestError('cannot delete question from published quiz')
			const question = await Question.findOneAndDelete({ _id: id, userId, quizId }, { session })
			res = !!question
			return res
		})
		return res
	}

	async deleteQuizQuestions(quizId: string) {
		const res = await Question.deleteMany({ quizId })
		return res.acknowledged
	}
}
