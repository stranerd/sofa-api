import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams } from 'equipped'
import { IAnswerRepository } from '../../domain/irepositories/answers'
import { PlayStatus, PlayTypes } from '../../domain/types'
import { AnswerMapper } from '../mappers/answers'
import { PlayMapper } from '../mappers/plays'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { Answer } from '../mongooseModels/answers'
import { Play } from '../mongooseModels/plays'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private mapper = new AnswerMapper()
	private playMapper = new PlayMapper()

	static getInstance() {
		if (!AnswerRepository.instance) AnswerRepository.instance = new AnswerRepository()
		return AnswerRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Answer, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async answer({ type, typeId, userId, questionId, answer }: AnswerToModel) {
		let res = null as AnswerFromModel | null
		await Answer.collection.conn.transaction(async (session) => {
			const play = await this.#verifyType(type, typeId, { questionId, userId }, session)
			if (!play) throw new BadRequestError('cannot answer this question')
			const typeUserId = play.user.id
			const now = Date.now()
			const timedOutAt = play.getUsesTimer() ? now + play.totalTimeInSec * 1000 : null
			const answerModel = await Answer.findOneAndUpdate(
				{ type, typeId, typeUserId, userId },
				{ $setOnInsert: { type, typeId, typeUserId, userId, timedOutAt } },
				{ upsert: true, new: true, session },
			)
			if (answerModel.timedOutAt && answerModel.timedOutAt < now) throw new BadRequestError('you have already played this')
			if (answerModel.endedAt ?? 0 > 0) throw new BadRequestError('you have already played this')

			const newAnswer = questionId
				? await Answer.findByIdAndUpdate(
						answerModel._id,
						{ $set: { [`data.${questionId}`]: { value: answer, at: now } } },
						{ upsert: true, new: true, session },
					)
				: answerModel
			res = newAnswer
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async find(id: string) {
		const answer = await Answer.findById(id)
		return this.mapper.mapFrom(answer)
	}

	async deleteTypeAnswers(type: PlayTypes, typeId: string) {
		const answers = await Answer.deleteMany({ type, typeId })
		return answers.acknowledged
	}

	async end({ type, typeId, userId }: Omit<AnswerToModel, 'answer' | 'questionId'>) {
		const res = await Answer.findOneAndUpdate({ type, typeId, userId, endedAt: null }, { $set: { endedAt: Date.now() } }, { new: true })
		return this.mapper.mapFrom(res)
	}

	async reset({ type, typeId, userId }: Omit<AnswerToModel, 'answer' | 'questionId'>) {
		if (![PlayTypes.practice, PlayTypes.flashcards].includes(type)) return null
		const res = await Answer.findOneAndUpdate(
			{ type, typeId, userId, endedAt: null },
			{ $set: { endedAt: null, data: {} } },
			{ new: true },
		)
		return this.mapper.mapFrom(res)
	}

	async #verifyType(type: PlayTypes, typeId: string, data: { questionId: string | null; userId: string }, session: any) {
		const play = this.playMapper.mapFrom(await Play.findById(typeId, {}, { session }))
		if (!play) return null
		if (play.data.type !== type) return null
		if (data.questionId && !play.questions.includes(data.questionId)) return null
		if (!play.getActiveParticipants().includes(data.userId)) return null
		if (play.status !== PlayStatus.started) return null
		return play
	}
}
