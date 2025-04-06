import type { CoursableData, FileType, Media } from '../types'
import { CoursableEntity } from './coursables'

export class FileEntity extends CoursableEntity<FileConstructorArgs, 'media.link'> implements CoursableData {
	__ignoreInJSON = ['media.link' as const]

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
