import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams, Validation } from 'equipped'
import { IQuizRepository } from '../../domain/irepositories/quizzes'
import { DraftStatus, EmbeddedUser, QuizMeta, QuizQuestions } from '../../domain/types'
import { QuizMapper } from '../mappers/quizzes'
import { QuizFromModel, QuizToModel } from '../models/quizzes'
import { Quiz } from '../mongooseModels/quizzes'

const compareQuizSections = (arr1: QuizFromModel['questions'], arr2: QuizFromModel['questions']): boolean => {
	const [sorted1, sorted2] = [arr1, arr2]
		.map((arr) => arr.flatMap((i) => (typeof i === 'string' ? [i] : i.items)))
		.map((arr) => [...new Set(arr)].sort())
	if (sorted1.length !== sorted2.length) return false
	return Validation.Differ.equal(sorted1, sorted2)
}

export class QuizRepository implements IQuizRepository {
	private static instance: QuizRepository
	private mapper: QuizMapper

	private constructor() {
		this.mapper = new QuizMapper()
	}

	static getInstance() {
		if (!QuizRepository.instance) QuizRepository.instance = new QuizRepository()
		return QuizRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Quiz, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: QuizToModel) {
		const quiz = await new Quiz(data).save()
		return this.mapper.mapFrom(quiz)!
	}

	async find(id: string) {
		const quiz = await Quiz.findById(id)
		return this.mapper.mapFrom(quiz)
	}

	async update(id: string, userId: string, data: Partial<QuizToModel>) {
		const quiz = await Quiz.findOneAndUpdate(
			{
				_id: id,
				'user.id': userId,
			},
			{ $set: data },
			{ new: true },
		)
		return this.mapper.mapFrom(quiz)
	}

	async updateUserBio(user: EmbeddedUser) {
		const quizzes = await Quiz.updateMany({ 'user.id': user.id }, { $set: { user } })
		return quizzes.acknowledged
	}

	async delete(id: string, userId: string) {
		const quiz = await Quiz.findOneAndDelete({
			_id: id,
			'user.id': userId,
			$or: [{ courseId: null }, { courseId: { $ne: null }, status: DraftStatus.draft }],
		})
		return !!quiz
	}

	async publish(id: string, userId: string) {
		const quiz = await Quiz.findOneAndUpdate(
			{
				_id: id,
				'user.id': userId,
				status: DraftStatus.draft,
				courseId: null,
			},
			{ $set: { status: DraftStatus.published } },
			{ new: true },
		)
		return this.mapper.mapFrom(quiz)
	}

	async toggleQuestion(id: string, userId: string, questionId: string, add: boolean) {
		const quiz = await Quiz.findOneAndUpdate(
			{
				_id: id,
				'user.id': userId,
			},
			{
				[add ? '$addToSet' : '$pull']: add
					? { label: '', items: [questionId] }
					: {
							questions: questionId,
							'questions.$[].items': questionId,
						},
			},
			{ new: true },
		)
		return this.mapper.mapFrom(quiz)
	}

	async updateQuestions(id: string, userId: string, questions: QuizQuestions) {
		let res = null as QuizFromModel | null
		await Quiz.collection.conn.transaction(async (session) => {
			const quiz = await Quiz.findOne(
				{
					_id: id,
					$or: [{ 'user.id': userId }, { 'access.members': userId }],
				},
				null,
				{ session },
			)
			if (!quiz) throw new BadRequestError('quiz not found')
			if (!compareQuizSections(quiz.questions, questions)) return
			res = await Quiz.findByIdAndUpdate(id, { $set: { questions } }, { new: true, session })
		})
		return this.mapper.mapFrom(res)
	}

	async updateMeta(commentId: string, property: QuizMeta, value: 1 | -1) {
		await Quiz.findByIdAndUpdate(commentId, {
			$inc: { [`meta.${property}`]: value, [`meta.${QuizMeta.total}`]: value },
		})
	}

	async updateRatings(id: string, ratings: number, add: boolean) {
		let res = false
		await Quiz.collection.conn.transaction(async (session) => {
			const quiz = await Quiz.findById(id, {}, { session })
			if (!quiz) return res
			quiz.ratings.total += (add ? 1 : -1) * ratings
			quiz.ratings.count += add ? 1 : -1
			quiz.ratings.avg = Number((quiz.ratings.total / quiz.ratings.count).toFixed(2))
			res = !!(await quiz.save({ session }))
			return res
		})
		return res
	}

	async requestAccess(id: string, userId: string, add: boolean) {
		const quiz = await Quiz.findOneAndUpdate(
			{
				_id: id,
				'access.requests': { [add ? '$nin' : '$in']: userId },
				'user.id': { $ne: userId },
			},
			{
				[add ? '$addToSet' : '$pull']: { 'access.requests': userId },
			},
		)
		return !!quiz
	}

	async grantAccess(id: string, ownerId: string, userId: string, grant: boolean) {
		const quiz = await Quiz.findByIdAndUpdate(
			{
				_id: id,
				'user.id': ownerId,
				'access.requests': { $in: userId },
			},
			{
				$pull: { 'access.requests': userId },
				...(grant ? { $addToSet: { 'access.members': userId } } : {}),
			},
		)
		return !!quiz
	}

	async addMembers(id: string, ownerId: string, userIds: string[], grant: boolean) {
		const quiz = await Quiz.findByIdAndUpdate(
			{
				_id: id,
				'user.id': ownerId,
			},
			{
				...(grant
					? {
							$addToSet: { 'access.members': { $each: userIds } },
							$pull: { 'access.requests': { $in: userIds } },
						}
					: {
							$pull: {
								'access.members': { $in: userIds },
								'access.requests': { $in: userIds },
							},
						}),
			},
		)
		return !!quiz
	}
}
