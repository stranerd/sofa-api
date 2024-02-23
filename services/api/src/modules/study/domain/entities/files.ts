import { CoursableData, FileType, Media } from '../types'
import { CoursableEntity } from './coursables'

export class FileEntity extends CoursableEntity<FileConstructorArgs> implements CoursableData {
	ignoreInJSON = ['media.link']

	constructor(data: FileConstructorArgs) {
		super(data)
	}
}

type FileConstructorArgs = CoursableData & {
	id: string
	type: FileType
	media: Media
	createdAt: number
	updatedAt: number
}
