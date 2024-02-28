import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams } from 'equipped'
import { ClientSession } from 'mongodb'
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
			const verified = await this.#verifyType(type, typeId, { questionId, userId }, session)
			if (!verified) throw new BadRequestError('cannot answer this question')
			const newAnswer = await Answer.findOneAndUpdate(
				{ type, typeId, userId },
				{
					$setOnInsert: { type, typeId, userId },
					$set: { [`data.${questionId}`]: { value: answer, at: Date.now() } },
				},
				{ upsert: true, new: true, session },
			)
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

	async #verifyType(type: PlayTypes, typeId: string, data: { questionId: string; userId: string }, session: ClientSession) {
		const play = this.playMapper.mapFrom(await Play.findById(typeId, {}, { session }))
		if (!play) return false
		if (play.data.type !== type) return false
		if (!play.questions.includes(data.questionId)) return false
		if (!play.getActiveParticipants().includes(data.userId)) return false
		if (play.status !== PlayStatus.started) return false
		return true
	}
}
