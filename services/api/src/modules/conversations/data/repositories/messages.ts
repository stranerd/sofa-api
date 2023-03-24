import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IMessageRepository } from '../../domain/irepositories/messages'
import { MessageMapper } from '../mappers/messages'
import { MessageToModel } from '../models/messages'
import { Conversation } from '../mongooseModels/conversations'
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
		let res = null as any
		await Message.collection.conn.transaction(async (session) => {
			const createdAt = Date.now()
			const message = await new Message({
				...data, createdAt, updatedAt: createdAt,
				readAt: { [data.userId]: createdAt }
			}).save({ session })
			await Conversation.findByIdAndUpdate(
				data.conversationId,
				{
					$set: { last: message },
					$max: { [`readAt.${data.userId}`]: createdAt }
				}, { session })
			res = message
			return res
		})
		return this.mapper.mapFrom(res)!
	}

	async find (id: string) {
		const message = await Message.findById(id)
		return this.mapper.mapFrom(message)
	}

	async star (conversationId: string, id: string, _: string, starred: boolean) {
		const message = await Message.findOneAndUpdate({ _id: id, conversationId }, { $set: { starred } })
		return this.mapper.mapFrom(message)
	}

	async deleteConversationMessages (conversationId: string) {
		const res = await Message.deleteMany({ conversationId })
		return res.acknowledged
	}

	async markRead (userId: string, conversationId: string) {
		const readAt = Date.now()
		let res = false
		await Message.collection.conn.transaction(async (session) => {
			const conversation = await Conversation.findByIdAndUpdate(
				conversationId,
				{ $max: { [`readAt.${userId}`]: readAt } },
				{ session }
			)
			if (!conversation) return false
			await Message.updateMany(
				{ conversationId, [`readAt.${userId}`]: null },
				{ $set: { [`readAt.${userId}`]: readAt } },
				{ session }
			)
			res = true
			return res
		})
		return res
	}
}