import { BaseMapper } from 'equipped'
import { DepartmentEntity } from '../../domain/entities/departments'
import { DepartmentFromModel, DepartmentToModel } from '../models/departments'

export class DepartmentMapper extends BaseMapper<DepartmentFromModel, DepartmentToModel, DepartmentEntity> {
	mapFrom (model: DepartmentFromModel | null) {
		if (!model) return null
		const { _id, name, institutionId, facultyId, createdAt, updatedAt } = model
		return new DepartmentEntity({
			id: _id.toString(), name, institutionId, facultyId, createdAt, updatedAt
		})
	}

	mapTo (entity: DepartmentEntity) {
		return {
			name: entity.name,
			institutionId: entity.institutionId,
			facultyId: entity.facultyId
		}
	}
}