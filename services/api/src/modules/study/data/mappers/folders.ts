import { BaseMapper } from 'equipped'
import { FolderEntity } from '../../domain/entities/folders'
import { FolderFromModel, FolderToModel } from '../models/folders'

export class FolderMapper extends BaseMapper<FolderFromModel, FolderToModel, FolderEntity> {
	mapFrom (model: FolderFromModel | null) {
		if (!model) return null
		const { _id, name, saved, user, createdAt, updatedAt } = model
		return new FolderEntity({
			id: _id.toString(), name, saved, user, createdAt, updatedAt
		})
	}

	mapTo (entity: FolderEntity) {
		return {
			name: entity.name,
			saved: entity.saved,
			user: entity.user
		}
	}
}