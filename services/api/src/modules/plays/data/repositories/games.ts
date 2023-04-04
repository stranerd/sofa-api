import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IGameRepository } from '../../domain/irepositories/games'
import { EmbeddedUser, GameStatus } from '../../domain/types'
import { GameMapper } from '../mappers/games'
import { GameToModel } from '../models/games'
import { Game } from '../mongooseModels/games'

export class GameRepository implements IGameRepository {
	private static instance: GameRepository
	private mapper: GameMapper

	private constructor () {
		this.mapper = new GameMapper()
	}

	static getInstance () {
		if (!GameRepository.instance) GameRepository.instance = new GameRepository()
		return GameRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Game, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: GameToModel) {
		const game = await new Game(data).save()
		return this.mapper.mapFrom(game)!
	}

	async find (id: string) {
		const game = await Game.findById(id)
		return this.mapper.mapFrom(game)
	}

	async updateUserBio (user: EmbeddedUser) {
		const games = await Game.updateMany({ 'user.id': user.id }, { $set: { user } })
		return games.acknowledged
	}

	async delete (id: string, userId: string) {
		const game = await Game.findOneAndDelete({ _id: id, 'user.id': userId, status: GameStatus.created })
		return !!game
	}

	async start (id: string, userId: string, totalTimeInSec: number) {
		const startedAt = Date.now()
		const endedAt = startedAt + (totalTimeInSec + 3) * 1000
		const game = await Game.findOneAndUpdate(
			{ _id: id, 'user.id': userId, status: GameStatus.created },
			{ $set: { startedAt, endedAt, status: GameStatus.started } }, { new: true })
		return this.mapper.mapFrom(game)
	}

	async join (id: string, userId: string, join: boolean) {
		const game = await Game.findOneAndUpdate({
			_id: id, status: GameStatus.created
		}, {
			[join ? '$addToSet' : '$pull']: { 'participants': userId }
		}, { new: true })
		return this.mapper.mapFrom(game)
	}

	async end (id: string, userId: string) {
		const game = await Game.findOneAndUpdate(
			{ _id: id, 'user.id': userId, status: GameStatus.started },
			{ $set: { status: GameStatus.ended } }, { new: true })
		return this.mapper.mapFrom(game)
	}
}