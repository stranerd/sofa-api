import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { EmbeddedUser } from '../../domain/types'
import { ConversationMapper } from '../mappers/conversations'
import { ConversationToModel } from '../models/conversations'
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
		const conversations = await Conversation.updateMany({ 'user.id': user.id }, { $set: { user } })
		return conversations.acknowledged
	}

	async delete (id: string, userId: string) {
		const conversation = await Conversation.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!conversation
	}
}