import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams } from 'equipped'
import { ClientSession } from 'mongodb'
import { IAnswerRepository } from '../../domain/irepositories/answers'
import { PlayTypes, PlayStatus } from '../../domain/types'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { Answer } from '../mongooseModels/answers'
import { Game } from '../mongooseModels/games'
import { Test } from '../mongooseModels/tests'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private mapper: AnswerMapper

	private constructor() {
		this.mapper = new AnswerMapper()
	}

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

	async answer({ type, typeId, userId, questionId, answer }: AnswerToModel & { questionId: string; answer: any }) {
		let res = null as AnswerFromModel | null
		await Answer.collection.conn.transaction(async (session) => {
			const verified = await this.#verifyType(type, typeId, { questionId, userId }, session)
			if (!verified) throw new BadRequestError('cannot answer this question')
			const newAnswer = await Answer.findOneAndUpdate(
				{ type, typeId, userId },
				{
					$setOnInsert: { type, typeId, userId },
					$set: { [`data.${questionId}`]: answer },
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
		if (type === PlayTypes.games) {
			const game = await Game.findById(typeId, {}, { session })
			if (!game) return false
			if (!game.questions.includes(data.questionId)) return false
			if (!game.participants.includes(data.userId)) return false
			if (game.status !== PlayStatus.started) return false
			return true
		}
		if (type === PlayTypes.tests) {
			const test = await Test.findById(typeId, {}, { session })
			if (!test) return false
			if (!test.questions.includes(data.questionId)) return false
			if (test.user.id !== data.userId) return false
			if (test.status !== PlayStatus.started) return false
			return true
		}
		return false
	}
}
