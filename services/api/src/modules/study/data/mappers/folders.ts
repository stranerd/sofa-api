import { BaseMapper } from 'equipped'
import { FolderEntity } from '../../domain/entities/folders'
import { FolderFromModel, FolderToModel } from '../models/folders'

export class FolderMapper extends BaseMapper<FolderFromModel, FolderToModel, FolderEntity> {
	mapFrom (model: FolderFromModel | null) {
		if (!model) return null
		const { _id, title, saved, user, createdAt, updatedAt } = model
		return new FolderEntity({
			id: _id.toString(), title, saved, user, createdAt, updatedAt
		})
	}

	mapTo (entity: FolderEntity) {
		return {
			title: entity.title,
			saved: entity.saved,
			user: entity.user
		}
	}
}