import { BaseMapper } from 'equipped'
import { FolderEntity } from '../../domain/entities/folders'
import { FolderFromModel, FolderToModel } from '../models/folders'

export class FolderMapper extends BaseMapper<FolderFromModel, FolderToModel, FolderEntity> {
	mapFrom(model: FolderFromModel | null) {
		if (!model) return null
		const { _id, ...rest } = model
		return new FolderEntity({
			id: _id.toString(),
			...rest,
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
