import { appInstance } from '@utils/types'

import type { IVerificationRepository } from '../../domain/irepositories/verifications'
import type { AcceptVerificationInput } from '../../domain/types'
import { VerificationMapper } from '../mappers/verifications'
import type { VerificationToModel } from '../models/verifications'
import { Verification } from '../mongooseModels/verifications'

export class VerificationRepository implements IVerificationRepository {
	private static instance: VerificationRepository
	private mapper = new VerificationMapper()

	static getInstance(): VerificationRepository {
		if (!VerificationRepository.instance) VerificationRepository.instance = new VerificationRepository()
		return VerificationRepository.instance
	}

	async find(id: string) {
		const verification = await Verification.findById(id)
		return this.mapper.mapFrom(verification)
	}

	async get(query) {
		const data = await appInstance.dbs.mongo.query(Verification, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!),
		}
	}

	async create(data: VerificationToModel) {
		const verification = await Verification.findOneAndUpdate(
			{ userId: data.userId, pending: true },
			{ $set: { ...data }, $setOnInsert: { pending: true, accepted: false } },
			{ upsert: true, new: true },
		)
		return this.mapper.mapFrom(verification)!
	}

	async accept({ id, data }: { id: string; data: AcceptVerificationInput }) {
		const verification = await Verification.findOneAndUpdate(
			{ _id: id, pending: true },
			{ $set: { accepted: { is: data.accept, message: data.message, at: Date.now() }, pending: false } },
			{ new: true },
		)
		return this.mapper.mapFrom(verification)
	}
}
