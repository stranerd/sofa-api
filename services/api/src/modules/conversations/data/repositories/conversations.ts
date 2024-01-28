import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams } from 'equipped'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { EmbeddedUser } from '../../domain/types'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationToModel } from '../models/conversations'
import { MessageFromModel } from '../models/messages'
import { Conversation } from '../mongooseModels/conversations'
import { Message } from '../mongooseModels/messages'

export class ConversationRepository implements IConversationRepository {
	private static instance: ConversationRepository
	private mapper: ConversationMapper

	private constructor () {
		this.mapper = new ConversationMapper()
	}

	static getInstance () {
		if (!ConversationRepository.instance) ConversationRepository.instance = new ConversationRepository()
		return ConversationRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Conversation, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: ConversationToModel) {
		const conversation = await new Conversation(data).save()
		return this.mapper.mapFrom(conversation)!
	}

	async find (id: string) {
		const conversation = await Conversation.findById(id)
		return this.mapper.mapFrom(conversation)
	}

	async updateUserBio (user: EmbeddedUser) {
		const conversations = await Promise.all([
			Conversation.updateMany({ 'user.id': user.id }, { $set: { user } }),
			Conversation.updateMany({ 'tutor.id': user.id }, { $set: { tutor: user } })
		])
		return conversations.every((c) => c.acknowledged)
	}

	async update (id: string, userId: string, data: Partial<ConversationToModel>) {
		const conversation = await Conversation.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(conversation)
	}

	async delete (id: string, userId: string) {
		let res = false
		await Conversation.collection.conn.transaction(async (session) => {
			const conversation = await Conversation.findOneAndDelete({ _id: id, 'user.id': userId }, { session })
			if (!conversation) throw new BadRequestError('conversation not found')
			await Message.deleteMany({ conversationId: conversation.id }, { session })
			res = !!conversation
			return res
		})

		return res
	}

	async accept ({ id, tutorId, accept }: { id: string, tutorId, accept: boolean }) {
		const conversation = await Conversation.findOneAndUpdate(
			{ _id: id, 'tutor.id': tutorId, pending: true, accepted: null },
			{ $set: { pending: false, accepted: { is: accept, at: Date.now() } } },
			{ new: true })
		return this.mapper.mapFrom(conversation)
	}

	async end (data: { conversationId: string, userId: string, rating: number, message: string }) {
		const conversation = await Conversation.findOneAndUpdate(
			{ _id: data.conversationId, 'user.id': data.userId, ended: null },
			{ $set: { ended: { at: Date.now(), rating: data.rating, message: data.message } } },
			{ new: true })
		return this.mapper.mapFrom(conversation)
	}

	async updateLastMessage (message: MessageFromModel) {
		await Conversation.updateMany({ 'last._id': message._id }, { $set: { last: message } })
	}
}