import { BaseMapper } from 'equipped'
import { FacultyEntity } from '../../domain/entities/faculties'
import { FacultyFromModel, FacultyToModel } from '../models/faculties'

export class FacultyMapper extends BaseMapper<FacultyFromModel, FacultyToModel, FacultyEntity> {
	mapFrom (model: FacultyFromModel | null) {
		if (!model) return null
		const { _id, name, institutionId, createdAt, updatedAt } = model
		return new FacultyEntity({
			id: _id.toString(), name, institutionId, createdAt, updatedAt
		})
	}

	mapTo (entity: FacultyEntity) {
		return {
			name: entity.name,
			institutionId: entity.institutionId
		}
	}
}