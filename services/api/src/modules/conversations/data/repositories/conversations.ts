import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { EmbeddedUser } from '../../domain/types'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationToModel } from '../models/conversations'
import { MessageFromModel } from '../models/messages'
import { Conversation } from '../mongooseModels/conversations'

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

	async setTutor (id: string, userId: string, tutor: EmbeddedUser | null) {
		const conversation = await Conversation.findOneAndUpdate({
			_id: id, 'user.id': userId, tutor: { [tutor ? '$eq' : '$ne']: null }
		}, { $set: { tutor } }, { new: true })
		return this.mapper.mapFrom(conversation)
	}

	async updateLastMessage (message: MessageFromModel) {
		await Conversation.updateMany({ 'last._id': message._id }, { $set: { last: message } })
	}
}