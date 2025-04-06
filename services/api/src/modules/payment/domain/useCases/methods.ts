import type { QueryParams } from 'equipped'
import { QueryKeys } from 'equipped'

import type { MethodToModel } from '../../data/models/methods'
import type { IMethodRepository } from '../irepositories/methods'

export class MethodsUseCase {
	repository: IMethodRepository

	constructor(repo: IMethodRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async create(data: MethodToModel) {
		return await this.repository.create(data)
	}

	async makePrimary(data: { id: string; userId: string }) {
		return await this.repository.makePrimary(data.id, data.userId)
	}

	async markExpireds() {
		return await this.repository.markExpireds()
	}

	async delete(data: { id: string; userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}

	async getForUser(userId: string, methodId: string | true | null) {
		if (methodId === true) return null
		const { results: methods } = await this.get({
			where: [
				{ field: 'userId', value: userId },
				{
					condition: QueryKeys.or,
					value: [{ field: 'primary', value: true }, ...(methodId ? [{ field: 'id', value: methodId }] : [])],
				},
			],
		})
		return methods.find((m) => m.id === methodId) ?? methods.find((m) => m.primary) ?? methods.at(0) ?? null
	}
}
