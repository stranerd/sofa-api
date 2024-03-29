import { Bucket, Storage } from '@google-cloud/storage'
import { environment } from '@utils/environment'
import { IUploaderRepository } from '../../domain/irepositories/uploader'
import { MediaInput } from '../models/media'

export class CloudUploaderRepository implements IUploaderRepository {
	private bucket: Bucket

	constructor() {
		this.bucket = new Storage().bucket(`stranerd${environment}.appspot.com`)
	}

	async delete(path: string) {
		if (!path) return false
		const file = this.bucket.file(path)
		const exists = (await file.exists())[0]
		if (exists) await file.delete()
		return exists
	}

	async upload(path: string, media: MediaInput) {
		media.data = Buffer.from(media.data)
		const timestamp = Date.now()
		media.name = media.name.toLowerCase()
		path = `storage/${environment}/${path}/${timestamp}-${media.name}`

		const file = this.bucket.file(path)

		await file.save(media.data)

		const link = file.publicUrl()

		return {
			name: media.name,
			type: media.type,
			size: media.size,
			duration: media.duration,
			path,
			timestamp,
			link,
		}
	}
}
