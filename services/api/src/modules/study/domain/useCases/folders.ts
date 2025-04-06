import type { QueryParams } from 'equipped'

import type { FolderToModel } from '../../data/models/folders'
import type { IFolderRepository } from '../irepositories/folders'
import type { EmbeddedUser, FolderSaved } from '../types'

export class FoldersUseCase {
	private repository: IFolderRepository

	constructor(repository: IFolderRepository) {
		this.repository = repository
	}

	async add(data: FolderToModel) {
		return await this.repository.add(data)
	}

	async delete(input: { id: string; userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async update(input: { id: string; userId: string; data: Partial<FolderToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async updateProp(input: { id: string; userId: string; prop: FolderSaved; add: boolean; values: string[] }) {
		return await this.repository.updateProp(input.id, input.userId, input.prop, input.add, input.values)
	}

	async removeProp(input: { prop: FolderSaved; value: string }) {
		return await this.repository.removeProp(input.prop, input.value)
	}
}
