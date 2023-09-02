import { appInstance } from '@utils/types'
import { BadRequestError, QueryParams } from 'equipped'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { EmbeddedUser } from '../../domain/types'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationFromModel, ConversationToModel } from '../models/conversations'
import { MessageFromModel } from '../models/messages'
import { Conversation } from '../mongooseModels/conversations'
import { TutorRequest } from '../mongooseModels/tutorRequests'
import { Message } from '../mongooseModels/messages'
import { TutorRequestFromModel } from '../models/tutorRequests'
import { TutorRequestMapper } from '../mappers/tutorRequests'

export class ConversationRepository implements IConversationRepository {
	private static instance: ConversationRepository
	private mapper: ConversationMapper
	private tutorRequestMapper: TutorRequestMapper

	private constructor () {
		this.mapper = new ConversationMapper()
		this.tutorRequestMapper = new TutorRequestMapper()
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
		const conversation = await Conversation.findByIdAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(conversation)
	}

	async delete (id: string, userId: string) {
		let res = false
		await Conversation.collection.conn.transaction(async (session) => {
			const conversation = await Conversation.findOneAndDelete({ _id: id, 'user.id': userId }, { session })
			if (!conversation) throw new BadRequestError('conversation not found')
			await TutorRequest.deleteMany({ conversationId: conversation.id }, { session })
			await Message.deleteMany({ conversationId: conversation.id }, { session })
			res = !!conversation
			return res
		})

		return res
	}

	async removeTutor (data: { conversationId: string, userId: string }) {
		const res = {
			conversation: null as ConversationFromModel | null,
			tutorRequest: null as TutorRequestFromModel | null
		}
		await Conversation.collection.conn.transaction(async (session) => {
			const conversation = await Conversation.findById(data.conversationId, {}, { session })
			if (!conversation) return
			if (conversation.user.id !== data.userId) return
			if (!conversation.tutor) return
			res.conversation = await Conversation.findByIdAndUpdate(data.conversationId, {
				$set: { tutor: null }
			}, { new: true, session })
			res.tutorRequest = await TutorRequest.findOne({
				conversationId: conversation.id, 'tutor.id': conversation.tutor.id, accepted: true,
			}, {}, { session }).sort({ createdAt: -1 })
			return res
		})
		return {
			conversation: this.mapper.mapFrom(res.conversation),
			tutorRequest: this.tutorRequestMapper.mapFrom(res.tutorRequest)
		}
	}

	async updateLastMessage (message: MessageFromModel) {
		await Conversation.updateMany({ 'last._id': message._id }, { $set: { last: message } })
	}
}