import { BaseMapper } from 'equipped'
import { FolderEntity } from '../../domain/entities/folders'
import { FolderFromModel, FolderToModel } from '../models/folders'

export class FolderMapper extends BaseMapper<FolderFromModel, FolderToModel, FolderEntity> {
	mapFrom(model: FolderFromModel | null) {
		if (!model) return null
		return !model
			? null
			: new FolderEntity({
					id: model._id.toString(),
					title: model.title,
					saved: model.saved,
					user: model.user,
					createdAt: model.createdAt,
					updatedAt: model.updatedAt,
				})
	}

	mapTo(entity: FolderEntity) {
		return {
			title: entity.title,
			saved: entity.saved,
			user: entity.user,
		}
	}
}
