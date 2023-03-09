import { QueryParams } from 'equipped'
import { CourseToModel } from '../../data/models/courses'
import { ICourseRepository } from '../irepositories/courses'

export class CoursesUseCase {
	private repository: ICourseRepository

	constructor (repository: ICourseRepository) {
		this.repository = repository
	}

	async add (data: CourseToModel) {
		return await this.repository.add(data)
	}

	async delete (id: string) {
		return await this.repository.delete(id)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, data: Partial<CourseToModel> }) {
		return await this.repository.update(input.id, input.data)
	}

	async deleteDepartmentCourses (departmentId: string) {
		return await this.repository.deleteDepartmentCourses(departmentId)
	}

	async deleteInstitutionCourses (institutionId: string) {
		return await this.repository.deleteInstitutionCourses(institutionId)
	}
}