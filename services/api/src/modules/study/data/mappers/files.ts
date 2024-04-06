import { BaseMapper } from 'equipped'
import { FileEntity } from '../../domain/entities/files'
import { FileFromModel, FileToModel } from '../models/files'

export class FileMapper extends BaseMapper<FileFromModel, FileToModel, FileEntity> {
	mapFrom(model: FileFromModel | null) {
		if (!model) return null
		const { _id, ...rest } = model
		return new FileEntity({
			id: _id.toString(),
			...rest,
		})
	}

	mapTo(entity: FileEntity) {
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
			media: entity.media,
		}
	}
}
