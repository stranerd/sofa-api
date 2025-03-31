import { PhoneErrorToModel } from '../../data/models/phoneErrors'
import { IPhoneErrorRepository } from '../irepositories/phoneErrors'

export class PhoneErrorsUseCase {
	private repository: IPhoneErrorRepository

	constructor(repository: IPhoneErrorRepository) {
		this.repository = repository
	}

	async add({ data, parentId }: { data: PhoneErrorToModel; parentId?: string }) {
		return await this.repository.add(data, parentId)
	}

	async get() {
		return await this.repository.get()
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}
}
