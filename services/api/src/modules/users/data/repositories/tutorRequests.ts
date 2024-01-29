import { appInstance } from '@utils/types'
import { ITutorRequestRepository } from '../../domain/irepositories/tutorRequests'
import { TutorRequestMapper } from '../mappers/tutorRequests'
import { TutorRequestToModel } from '../models/tutorRequests'
import { TutorRequest } from '../mongooseModels/tutorRequests'

export class TutorRequestRepository implements ITutorRequestRepository {
	private static instance: TutorRequestRepository
	private mapper = new TutorRequestMapper()

	static getInstance(): TutorRequestRepository {
		if (!TutorRequestRepository.instance) TutorRequestRepository.instance = new TutorRequestRepository()
		return TutorRequestRepository.instance
	}

	async find(id: string) {
		const tutorRequest = await TutorRequest.findById(id)
		return this.mapper.mapFrom(tutorRequest)
	}

	async get(query) {
		const data = await appInstance.dbs.mongo.query(TutorRequest, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!),
		}
	}

	async create(data: TutorRequestToModel) {
		const tutorRequest = await TutorRequest.findOneAndUpdate(
			{ userId: data.userId, pending: true, topicId: data.topicId },
			{ $set: { ...data }, $setOnInsert: { pending: true, accepted: false } },
			{ upsert: true, new: true },
		)
		return this.mapper.mapFrom(tutorRequest)!
	}

	async accept({ id, accept }: { id: string; accept: boolean }) {
		const tutorRequest = await TutorRequest.findOneAndUpdate({ _id: id, pending: true }, { $set: { accepted: accept, pending: false } })
		return !!tutorRequest
	}

	async markTestFinished(testId: string) {
		const tutorRequest = await TutorRequest.findOneAndUpdate({ testId }, { $set: { testFinished: true } })
		return !!tutorRequest
	}
}
