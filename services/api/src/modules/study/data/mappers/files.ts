import { BaseMapper } from 'equipped'

import { FileEntity } from '../../domain/entities/files'
import type { FileFromModel, FileToModel } from '../models/files'

export class FileMapper extends BaseMapper<FileFromModel, FileToModel, FileEntity> {
	mapFrom(model: FileFromModel | null) {
		if (!model) return null
		return !model
			? null
			: new FileEntity({
					id: model._id.toString(),
					title: model.title,
					description: model.description,
					photo: model.photo,
					courseIds: model.courseIds,
					user: model.user,
					topicId: model.topicId,
					tagIds: model.tagIds,
					status: model.status,
					type: model.type,
					media: model.media,
					ratings: model.ratings,
					createdAt: model.createdAt,
					updatedAt: model.updatedAt,
				})
	}

	mapTo(entity: FileEntity) {
		return {
			title: entity.title,
			description: entity.description,
			photo: entity.photo,
			user: entity.user,
			topicId: entity.topicId,
			tagIds: entity.tagIds,
			status: entity.status,
			type: entity.type,
			media: entity.media,
		}
	}
}
