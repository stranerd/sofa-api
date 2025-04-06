import type { EmailErrorToModel } from '../../data/models/emailErrors'
import type { IEmailErrorRepository } from '../irepositories/emailErrors'

export class EmailErrorsUseCase {
	private repository: IEmailErrorRepository

	constructor(repository: IEmailErrorRepository) {
		this.repository = repository
	}

	async add({ data, parentId }: { data: EmailErrorToModel; parentId?: string }) {
		return await this.repository.add(data, parentId)
	}

	async get() {
		return await this.repository.get()
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}
}
