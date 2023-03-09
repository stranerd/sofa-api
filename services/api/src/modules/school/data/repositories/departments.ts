import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { DepartmentEntity } from '../../domain/entities/departments'
import { IDepartmentRepository } from '../../domain/irepositories/departments'
import { DepartmentMapper } from '../mappers/departments'
import { DepartmentToModel } from '../models/departments'
import { Department } from '../mongooseModels/departments'

export class DepartmentRepository implements IDepartmentRepository {
	private static instance: DepartmentRepository
	private mapper: DepartmentMapper

	private constructor () {
		this.mapper = new DepartmentMapper()
	}

	static getInstance () {
		if (!DepartmentRepository.instance) DepartmentRepository.instance = new DepartmentRepository()
		return DepartmentRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Department, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async delete (id: string): Promise<boolean> {
		const deleteData = await Department.findByIdAndDelete(id)
		return !!deleteData
	}

	async deleteFacultyDepartments (facultyId: string): Promise<boolean> {
		const deleteData = await Department.deleteMany({ facultyId })
		return deleteData.acknowledged
	}

	async add (data: DepartmentToModel) {
		const department = await new Department(data).save()
		return this.mapper.mapFrom(department)!
	}

	async update (id: string, data: Partial<DepartmentToModel>) {
		const department = await Department.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(department)
	}

	async find (id: string): Promise<DepartmentEntity | null> {
		const department = await Department.findById(id)
		return this.mapper.mapFrom(department)
	}
}