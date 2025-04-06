import type { MediaInput } from '../../data/models/media'
import type { IUploaderRepository } from '../irepositories/uploader'

export class UploaderUseCase {
	private readonly uploader: IUploaderRepository

	constructor(uploader: IUploaderRepository) {
		this.uploader = uploader
	}

	async delete(path: string) {
		return await this.uploader.delete(path)
	}

	async upload(path: string, media: MediaInput) {
		return await this.uploader.upload(path, media)
	}

	async uploadMany(path: string, media: MediaInput[]) {
		return await Promise.all(media.map((m) => this.uploader.upload(path, m)))
	}
}
