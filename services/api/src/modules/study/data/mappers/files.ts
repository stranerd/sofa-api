import { BaseMapper } from 'equipped'
import { FileEntity } from '../../domain/entities/files'
import { FileFromModel, FileToModel } from '../models/files'

export class FileMapper extends BaseMapper<FileFromModel, FileToModel, FileEntity> {
	mapFrom (model: FileFromModel | null) {
		if (!model) return null
		const { _id, title, description, photo, type, media, courseId, user, topicId, tagIds, ratings, status, createdAt, updatedAt } = model
		return new FileEntity({
			id: _id.toString(), title, description, photo, type, media, ratings,
			courseId, user, topicId, tagIds, status, createdAt, updatedAt
		})
	}

	mapTo (entity: FileEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			courseId: entity.courseId,
			user: entity.user,
			topicId: entity.topicId,
			tagIds: entity.tagIds,
			status: entity.status,
			type: entity.type,
			media: entity.media
		}
	}
}