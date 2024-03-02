import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IPlayRepository } from '../../domain/irepositories/plays'
import { EmbeddedUser, PlayScore, PlayStatus, PlayTypes } from '../../domain/types'
import { PlayMapper } from '../mappers/plays'
import { PlayFromModel, PlayToModel } from '../models/plays'
import { Play } from '../mongooseModels/plays'

export class PlayRepository implements IPlayRepository {
	private static instance: PlayRepository
	mapper = new PlayMapper()

	static getInstance() {
		if (!PlayRepository.instance) PlayRepository.instance = new PlayRepository()
		return PlayRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Play, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: PlayToModel) {
		const upsertTypes = [PlayTypes.practice, PlayTypes.flashcards]
		const play = await (upsertTypes.includes(data.data.type)
			? Play.findOneAndUpdate(
					{
						'data.type': data.data.type,
						'user.id': data.user.id,
						status: { $in: [PlayStatus.created, PlayStatus.started] },
						quizId: data.quizId,
					},
					{ $set: data },
					{ new: true, upsert: true },
				)
			: new Play(data).save())
		return this.mapper.mapFrom(play)!
	}

	async find(id: string) {
		const play = await Play.findById(id)
		return this.mapper.mapFrom(play)
	}

	async updateUserBio(user: EmbeddedUser) {
		const plays = await Play.updateMany({ 'user.id': user.id }, { $set: { user } })
		return plays.acknowledged
	}

	async delete(id: string, userId: string) {
		const play = await Play.findOneAndDelete({ _id: id, 'user.id': userId, status: PlayStatus.created })
		return !!play
	}

	async start(id: string, userId: string) {
		const play = await Play.findOneAndUpdate(
			{ _id: id, 'user.id': userId, status: PlayStatus.created },
			{ $set: { startedAt: Date.now(), status: PlayStatus.started } },
			{ new: true },
		)
		return this.mapper.mapFrom(play)
	}

	async end(id: string, userId: string) {
		const play = await Play.findOneAndUpdate(
			{ _id: id, 'user.id': userId, status: PlayStatus.started },
			{ $set: { endedAt: Date.now(), status: PlayStatus.ended } },
			{ new: true },
		)
		return this.mapper.mapFrom(play)
	}

	async score(id: string, userId: string, scores: PlayScore) {
		const play = await Play.findOneAndUpdate(
			{ _id: id, 'user.id': userId, status: PlayStatus.ended },
			{ $set: { scores, status: PlayStatus.scored } },
			{ new: true },
		)
		return this.mapper.mapFrom(play)
	}

	async join(id: string, userId: string, join: boolean) {
		let res = null as PlayFromModel | null
		await Play.collection.conn.transaction(async (session) => {
			const joinableTypes = [PlayTypes.games, PlayTypes.assessments]
			const play = this.mapper.mapFrom(await Play.findById(id, {}, { session }))
			if (!play || !joinableTypes.includes(play.data.type)) return
			if (![PlayStatus.created, PlayStatus.started].includes(play.status)) return
			return (res = await Play.findByIdAndUpdate(
				play.id,
				{ [join ? '$addToSet' : '$pull']: { 'data.participants': userId } },
				{ new: true },
			))
		})
		return this.mapper.mapFrom(res)
	}
}
