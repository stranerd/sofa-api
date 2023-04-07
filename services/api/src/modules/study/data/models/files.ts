import { CoursableData, FileType, Media } from '../../domain/types'

export interface FileFromModel extends FileToModel {
	_id: string
	questions: string[]
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends CoursableData {
	type: FileType
	media: Media
}