import { CoursableData, FileType, Media } from '../../domain/types'

export interface FileFromModel extends FileToModel {
	_id: string
	questions: string[]
	ratings: CoursableData['ratings']
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings'> {
	type: FileType
	media: Media
}