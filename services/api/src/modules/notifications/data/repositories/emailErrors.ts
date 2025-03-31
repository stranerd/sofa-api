import { IEmailErrorRepository } from '../../domain/irepositories/emailErrors'
import { EmailErrorMapper } from '../mappers/emailErrors'
import { EmailErrorToModel } from '../models/emailErrors'
import { EmailError } from '../mongooseModels/emailErrors'

export class EmailErrorRepository implements IEmailErrorRepository {
	private static instance: EmailErrorRepository
	private mapper: EmailErrorMapper

	private constructor() {
		this.mapper = new EmailErrorMapper()
	}

	static getInstance() {
		if (!EmailErrorRepository.instance) EmailErrorRepository.instance = new EmailErrorRepository()
		return EmailErrorRepository.instance
	}

	async add(data: EmailErrorToModel, id: string | undefined) {
		const error = await EmailError.findByIdAndUpdate(id, { $set: data, $inc: { tries: 1 } }, { upsert: true, new: true })
		return this.mapper.mapFrom(error)!
	}

	async get() {
		const errors = await EmailError.find()
		return errors.map((error) => this.mapper.mapFrom(error)!)
	}

	async delete(id: string) {
		const error = await EmailError.findByIdAndDelete(id)
		return !!error
	}
}
