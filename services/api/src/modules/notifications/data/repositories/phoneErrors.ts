import type { IPhoneErrorRepository } from '../../domain/irepositories/phoneErrors'
import { PhoneErrorMapper } from '../mappers/phoneErrors'
import type { PhoneErrorToModel } from '../models/phoneErrors'
import { PhoneError } from '../mongooseModels/phoneErrors'

export class PhoneErrorRepository implements IPhoneErrorRepository {
	private static instance: PhoneErrorRepository
	private mapper: PhoneErrorMapper

	private constructor() {
		this.mapper = new PhoneErrorMapper()
	}

	static getInstance() {
		if (!PhoneErrorRepository.instance) PhoneErrorRepository.instance = new PhoneErrorRepository()
		return PhoneErrorRepository.instance
	}

	async add(data: PhoneErrorToModel, id: string | undefined) {
		const error = await PhoneError.findByIdAndUpdate(id, { $set: data, $inc: { tries: 1 } }, { upsert: true, new: true })
		return this.mapper.mapFrom(error)!
	}

	async get() {
		const errors = await PhoneError.find()
		return errors.map((error) => this.mapper.mapFrom(error)!)
	}

	async delete(id: string) {
		const error = await PhoneError.findByIdAndDelete(id)
		return !!error
	}
}
