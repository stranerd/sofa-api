import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IMessageRepository } from '../../domain/irepositories/messages'
import { MessageMapper } from '../mappers/messages'
import { MessageToModel } from '../models/messages'
import { Message } from '../mongooseModels/messages'

export class MessageRepository implements IMessageRepository {
	private static instance: MessageRepository
	private mapper: MessageMapper

	private constructor () {
		this.mapper = new MessageMapper()
	}

	static getInstance () {
		if (!MessageRepository.instance) MessageRepository.instance = new MessageRepository()
		return MessageRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Message, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: MessageToModel) {
		const message = await new Message(data).save()
		return this.mapper.mapFrom(message)!
	}

	async find (id: string) {
		const message = await Message.findById(id)
		return this.mapper.mapFrom(message)
	}

	async star (conversationId: string, id: string, userId: string, starred: boolean) {
		const message = await Message.findOneAndUpdate({ _id: id, conversationId, userId }, { $set: { starred } })
		return this.mapper.mapFrom(message)
	}

	async deleteConversationMessages (conversationId: string) {
		const res = await Message.deleteMany({ conversationId })
		return res.acknowledged
	}
}