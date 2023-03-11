import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IQuizRepository } from '../../domain/irepositories/quizzes'
import { DraftStatus, EmbeddedUser } from '../../domain/types'
import { QuizMapper } from '../mappers/quizzes'
import { QuizToModel } from '../models/quizzes'
import { Quiz } from '../mongooseModels/quizzes'

export class QuizRepository implements IQuizRepository {
	private static instance: QuizRepository
	private mapper: QuizMapper

	private constructor () {
		this.mapper = new QuizMapper()
	}

	static getInstance () {
		if (!QuizRepository.instance) QuizRepository.instance = new QuizRepository()
		return QuizRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Quiz, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: QuizToModel) {
		const quiz = await new Quiz(data).save()
		return this.mapper.mapFrom(quiz)!
	}

	async find (id: string) {
		const quiz = await Quiz.findById(id)
		return this.mapper.mapFrom(quiz)
	}

	async update (id: string, userId: string, data: Partial<QuizToModel>) {
		const quiz = await Quiz.findOneAndUpdate({
			_id: id, 'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(quiz)
	}

	async updateUserBio (user: EmbeddedUser) {
		const quizs = await Quiz.updateMany({ 'user.id': user.id }, { $set: { user } })
		return quizs.acknowledged
	}

	async delete (id: string, userId: string) {
		const quiz = await Quiz.findOneAndDelete({ _id: id, 'user.id': userId, status: DraftStatus.draft })
		return !!quiz
	}

	async publish (id: string, userId: string) {
		const quiz = await Quiz.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.draft
		}, { $set: { status: DraftStatus.published } }, { new: true })
		return this.mapper.mapFrom(quiz)
	}

	async freeze (id: string, userId: string) {
		const quiz = await Quiz.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.published
		}, { $set: { status: DraftStatus.frozen } }, { new: true })
		return this.mapper.mapFrom(quiz)
	}

	async toggleQuestion (id: string, userId: string, questionId: string, add: boolean) {
		const quiz = await Quiz.findOneAndUpdate({
			_id: id, 'user.id': userId
		}, { [add ? '$addToSet' : '$pull']: { questions: questionId } }, { new: true })
		return this.mapper.mapFrom(quiz)
	}
}