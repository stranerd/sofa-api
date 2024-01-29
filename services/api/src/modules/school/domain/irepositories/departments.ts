import { QueryParams, QueryResults } from 'equipped'
import { DepartmentToModel } from '../../data/models/departments'
import { DepartmentEntity } from '../entities/departments'

export interface IDepartmentRepository {
	add: (data: DepartmentToModel) => Promise<DepartmentEntity>
	update: (id: string, data: Partial<DepartmentToModel>) => Promise<DepartmentEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<DepartmentEntity>>
	find: (id: string) => Promise<DepartmentEntity | null>
	delete: (id: string) => Promise<boolean>
	deleteFacultyDepartments: (facultyId: string) => Promise<boolean>
}
