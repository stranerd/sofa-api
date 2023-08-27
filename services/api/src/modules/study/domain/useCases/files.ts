import { QueryParams } from 'equipped'
import { FileToModel } from '../../data/models/files'
import { IFileRepository } from '../irepositories/files'
import { EmbeddedUser } from '../types'

export class FilesUseCase {
	private repository: IFileRepository

	constructor (repository: IFileRepository) {
		this.repository = repository
	}

	async add (data: FileToModel) {
		return await this.repository.add(data)
	}

	async delete (input: { id: string, userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, userId: string, data: Partial<FileToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async publish (input: { id: string, userId: string }) {
		return await this.repository.publish(input.id, input.userId)
	}

	async deleteCourseFiles (courseId: string) {
		return await this.repository.deleteCourseFiles(courseId)
	}

	async updateRatings (input: { id: string, ratings: number, add: boolean }) {
		return await this.repository.updateRatings(input.id, input.ratings, input.add)
	}
}