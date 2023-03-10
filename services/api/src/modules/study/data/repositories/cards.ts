import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ICardRepository } from '../../domain/irepositories/cards'
import { DraftStatus, EmbeddedUser } from '../../domain/types'
import { CardMapper } from '../mappers/cards'
import { CardToModel } from '../models/cards'
import { Card } from '../mongooseModels/cards'

export class CardRepository implements ICardRepository {
	private static instance: CardRepository
	private mapper: CardMapper

	private constructor () {
		this.mapper = new CardMapper()
	}

	static getInstance () {
		if (!CardRepository.instance) CardRepository.instance = new CardRepository()
		return CardRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Card, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: CardToModel) {
		const card = await new Card(data).save()
		return this.mapper.mapFrom(card)!
	}

	async find (id: string) {
		const card = await Card.findById(id)
		return this.mapper.mapFrom(card)
	}

	async update (id: string, userId: string, data: Partial<CardToModel>) {
		const card = await Card.findOneAndUpdate({
			_id: id, 'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(card)
	}

	async updateUserBio (user: EmbeddedUser) {
		const cards = await Card.updateMany({ 'user.id': user.id }, { $set: { user } })
		return cards.acknowledged
	}

	async delete (id: string, userId: string) {
		const card = await Card.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!card
	}

	async saveMatch (cardId: string, userId: string, time: number) {
		time = Number(time.toFixed(1))
		const key = `study-card-matches-${cardId}-${userId}`
		const value = await appInstance.cache.get(key)
		const cachedTime = Number(value ?? '0')
		if (cachedTime && time >= cachedTime) return { time: cachedTime, record: false }
		await appInstance.cache.set(key, time.toString(), -1)
		return { time, record: true }
	}

	async updatePrice (id: string, userId: string, price: CardToModel['price']) {
		const card = await Card.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.draft
		}, { $set: { price } }, { new: true })
		return this.mapper.mapFrom(card)
	}

	async publish (id: string, userId: string) {
		const card = await Card.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.draft
		}, { $set: { status: DraftStatus.published } }, { new: true })
		return this.mapper.mapFrom(card)
	}
}