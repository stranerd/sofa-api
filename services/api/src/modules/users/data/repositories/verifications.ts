import { appInstance } from '@utils/types'
import { IVerificationRepository } from '../../domain/irepositories/verifications'
import { VerificationMapper } from '../mappers/verifications'
import { VerificationToModel } from '../models/verifications'
import { Verification } from '../mongooseModels/verifications'

export class VerificationRepository implements IVerificationRepository {
	private static instance: VerificationRepository
	private mapper = new VerificationMapper()

	static getInstance (): VerificationRepository {
		if (!VerificationRepository.instance) VerificationRepository.instance = new VerificationRepository()
		return VerificationRepository.instance
	}

	async find (id: string) {
		const verification = await Verification.findById(id)
		return this.mapper.mapFrom(verification)
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(Verification, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async create (data: VerificationToModel) {
		const verification = await Verification.findOneAndUpdate(
			{ userId: data.userId, pending: true },
			{ $set: { ...data } },
			{ upsert: true, new: true })
		return this.mapper.mapFrom(verification)!
	}

	async accept ({ id, accept }: { id: string, accept: boolean }) {
		const filter = { _id: id, pending: true }
		const verification = await Verification.findOneAndUpdate(filter, { $set: { accepted: accept, pending: false } })
		return !!verification
	}
}