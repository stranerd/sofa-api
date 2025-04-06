import type { CoursableData, FileType, Media } from '../../domain/types'

export interface FileFromModel extends FileToModel, CoursableData {
	_id: string
	questions: string[]
	ratings: CoursableData['ratings']
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings' | 'courseIds'> {
	type: FileType
	media: Media
}
