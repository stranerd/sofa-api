import { appInstance } from '@utils/types'
import { ITutorRequestRepository } from '../../domain/irepositories/tutorRequests'
import { TutorRequestMapper } from '../mappers/tutorRequests'
import { TutorRequestFromModel, TutorRequestToModel } from '../models/tutorRequests'
import { TutorRequest } from '../mongooseModels/tutorRequests'
import { Conversation } from '../mongooseModels/conversations'
import { ConversationMapper } from '../mappers/conversations'
import { EmbeddedUser } from '../../domain/types'

export class TutorRequestRepository implements ITutorRequestRepository {
	private static instance: TutorRequestRepository
	private mapper = new TutorRequestMapper()
	private conversationMapper = new ConversationMapper()

	static getInstance (): TutorRequestRepository {
		if (!TutorRequestRepository.instance) TutorRequestRepository.instance = new TutorRequestRepository()
		return TutorRequestRepository.instance
	}

	async find (id: string) {
		const tutorRequest = await TutorRequest.findById(id)
		return this.mapper.mapFrom(tutorRequest)
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(TutorRequest, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async create (data: TutorRequestToModel) {
		let res = null as TutorRequestFromModel | null
		await TutorRequest.collection.conn.transaction(async (session) => {
			const conversation = this.conversationMapper.mapFrom(await Conversation.findById(data.conversationId, {}, { session }))
			if (!conversation || conversation.user.id !== data.userId) throw new Error('Conversation not found')
			if (conversation.tutor) throw new Error('Conversation already has a tutor')
			const tutorRequest = await TutorRequest.findOneAndUpdate(
				{ conversationId: data.conversationId, pending: true },
				{ $setOnInsert: { ...data, pending: true, accepted: false } },
				{ upsert: true, new: true, session })
			res = tutorRequest
			return res
		})
		return this.mapper.mapFrom(res)!
	}

	async updateUserBio (user: EmbeddedUser) {
		const res = await TutorRequest.updateMany({ 'tutor.id': user.id }, { $set: { tutor: user } })
		return res.acknowledged
	}

	async accept ({ id, tutorId, accept }: { id: string, tutorId, accept: boolean }) {
		let res = false
		await TutorRequest.collection.conn.transaction(async (session) => {
			const tutorRequest = await TutorRequest.findOneAndUpdate({ _id: id, 'tutor.id': tutorId, pending: true }, { $set: { accepted: accept, pending: false } }, { session })
			if (!tutorRequest) throw new Error('Request not found')
			const conversation = this.conversationMapper.mapFrom(await Conversation.findById(tutorRequest.conversationId, {}, { session }))
			if (!conversation) throw new Error('Conversation not found')
			if (accept) {
				if (conversation.tutor && conversation.tutor.id !== tutorId) throw new Error('Conversation already has a tutor')
				await Conversation.findByIdAndUpdate(tutorRequest.conversationId, { $set: { tutor: tutorRequest.tutor } }, { new: true, session })
			}
			res = !!tutorRequest
			return res
		})
		return res
	}

	async delete (data: { id: string, userId: string }) {
		const tutorRequest = await TutorRequest.findOneAndDelete({ _id: data.id, userId: data.userId, pending: true })
		return !!tutorRequest
	}
}