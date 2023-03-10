import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ICardRepository } from '../../domain/irepositories/cards'
import { EmbeddedUser } from '../../domain/types'
import { CardMapper } from '../mappers/cards'
import { CardToModel } from '../models/cards'
import { FlashCard } from '../mongooseModels/cards'

export class FlashCardRepository implements ICardRepository {
	private static instance: FlashCardRepository
	private mapper: CardMapper

	private constructor () {
		this.mapper = new CardMapper()
	}

	static getInstance () {
		if (!FlashCardRepository.instance) FlashCardRepository.instance = new FlashCardRepository()
		return FlashCardRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(FlashCard, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: CardToModel) {
		const flashCard = await new FlashCard(data).save()
		return this.mapper.mapFrom(flashCard)!
	}

	async find (id: string) {
		const flashCard = await FlashCard.findById(id)
		return this.mapper.mapFrom(flashCard)
	}

	async update (id: string, userId: string, data: Partial<CardToModel>) {
		const flashCard = await FlashCard.findOneAndUpdate({
			_id: id,
			'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(flashCard)
	}

	async updateUserBio (user: EmbeddedUser) {
		const flashCards = await FlashCard.updateMany({ 'user.id': user.id }, { $set: { user } })
		return flashCards.acknowledged
	}

	async delete (id: string, userId: string) {
		const flashCard = await FlashCard.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!flashCard
	}

	async saveMatch (flashCardId: string, userId: string, time: number) {
		time = Number(time.toFixed(1))
		const key = `flashcard-matches-${flashCardId}-${userId}`
		const value = await appInstance.cache.get(key)
		const cachedTime = Number(value ?? '0')
		if (cachedTime && time >= cachedTime) return { time: cachedTime, record: false }
		await appInstance.cache.set(key, time.toString(), -1)
		return { time, record: true }
	}
}