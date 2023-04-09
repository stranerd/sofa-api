import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IAnswerRepository } from '../../domain/irepositories/answers'
import { GameStatus } from '../../domain/types'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { Answer } from '../mongooseModels/answers'
import { Game } from '../mongooseModels/games'

export class AnswerRepository implements IAnswerRepository {
	private static instance: AnswerRepository
	private mapper: AnswerMapper

	private constructor () {
		this.mapper = new AnswerMapper()
	}

	static getInstance () {
		if (!AnswerRepository.instance) AnswerRepository.instance = new AnswerRepository()
		return AnswerRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Answer, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async answer ({ gameId, userId, questionId, answer }: AnswerToModel & { questionId: string, answer: any }) {
		let res = null as AnswerFromModel | null
		await Answer.collection.conn.transaction(async (session) => {
			const game = await Game.findById(gameId, {}, { session })
			if (!game) return false
			if (!game.questions.includes(questionId)) return false
			if (!game.participants.includes(userId)) return false
			if (game.status !== GameStatus.started) return false
			const newAnswer = await Answer.findOneAndUpdate(
				{ gameId, userId },
				{
					$setOnInsert: { gameId, userId },
					$set: { [`data.${questionId}`]: answer }
				},
				{ upsert: true, new: true, session })
			res = newAnswer
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async find (id: string) {
		const answer = await Answer.findById(id)
		return this.mapper.mapFrom(answer)
	}

	async deleteGameAnswers (gameId: string) {
		const answers = await Answer.deleteMany({ gameId })
		return answers.acknowledged
	}
}