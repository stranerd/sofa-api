import { CoursableData, FileType, Media } from '../types'
import { CoursableEntity } from './coursables'

export class FileEntity extends CoursableEntity implements CoursableData {
	public readonly type: FileType
	public readonly media: Media
	ignoreInJSON = ['media.link']

	constructor(data: FileConstructorArgs) {
		super(data)
		this.type = data.type
		this.media = data.media
	}
}

type FileConstructorArgs = CoursableData & {
	id: string
	type: FileType
	media: Media
	createdAt: number
	updatedAt: number
}
