import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { EmbeddedUser } from '../../domain/types'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationFromModel, ConversationToModel } from '../models/conversations'
import { MessageFromModel } from '../models/messages'
import { ReviewToModel } from '../models/reviews'
import { Conversation } from '../mongooseModels/conversations'
import { Review } from '../mongooseModels/reviews'

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

	async delete (id: string, userId: string) {
		const conversation = await Conversation.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!conversation
	}

	async addTutor (id: string, userId: string, tutor: EmbeddedUser) {
		const conversation = await Conversation.findOneAndUpdate({
			_id: id, 'user.id': userId, tutor: null
		}, { $set: { tutor } }, { new: true })
		return this.mapper.mapFrom(conversation)
	}

	async removeTutor (data: Omit<ReviewToModel, 'to'>) {
		let res = null as ConversationFromModel | null
		await Conversation.collection.conn.transaction(async (session) => {
			const conversation = await Conversation.findById(data.conversationId, {}, { session })
			if (!conversation) return
			if (conversation.user.id !== data.user.id) return
			if (!conversation.tutor) return
			const updatedConversation = await Conversation.findByIdAndUpdate(data.conversationId, {
				$set: { tutor: null }
			}, { new: true, session })
			await Review.findOneAndUpdate({
				conversationId: data.conversationId, to: conversation.tutor.id
			}, { $set: { ...data, to: conversation.tutor.id } }, { new: true, upsert: true, session })
			res = updatedConversation
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async updateLastMessage (message: MessageFromModel) {
		await Conversation.updateMany({ 'last._id': message._id }, { $set: { last: message } })
	}
}