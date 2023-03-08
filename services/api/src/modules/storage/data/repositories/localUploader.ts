import { appId, baseDomain, environment } from '@utils/environment'
import fs from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { IUploaderRepository } from '../../domain/irepositories/uploader'
import { MediaInput } from '../models/media'

export class LocalUploaderRepository implements IUploaderRepository {
	async delete (path: string) {
		const mediaPath = resolve(join(process.cwd(), 'public', decodeURI(path)))
		const exists = !!(await fs.stat(mediaPath).catch(() => false))
		if (exists) fs.unlink(mediaPath)
		return exists
	}

	async upload (path: string, media: MediaInput) {
		const timestamp = Date.now()
		media.name = media.name.toLowerCase()
		path = `storage/${environment}/${path}/${timestamp}-${media.name}`
		const mediaPath = resolve(join(process.cwd(), 'public', path))
		const folder = dirname(mediaPath)
		const exists = !!(await fs.stat(folder).catch(() => false))
		if (!exists) await fs.mkdir(folder, { recursive: true })
		await fs.writeFile(mediaPath, media.data)
		path = encodeURI(path)
		return {
			name: media.name,
			type: media.type,
			size: media.size,
			duration: media.duration,
			path, timestamp,
			link: `${baseDomain}/${appId}/${path}`
		}
	}
}