import { BaseMapper } from 'equipped'
import { CourseEntity } from '../../domain/entities/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseMapper extends BaseMapper<CourseFromModel, CourseToModel, CourseEntity> {
	mapFrom (model: CourseFromModel | null) {
		if (!model) return null
		const { _id, title, institutionId, facultyId, departmentId, createdAt, updatedAt } = model
		return new CourseEntity({
			id: _id.toString(), title, institutionId, facultyId, departmentId, createdAt, updatedAt
		})
	}

	mapTo (entity: CourseEntity) {
		return {
			title: entity.title,
			institutionId: entity.institutionId,
			facultyId: entity.facultyId,
			departmentId: entity.departmentId
		}
	}
}