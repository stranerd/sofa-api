import type { QueryParams } from 'equipped'

import { appInstance } from '@utils/types'

import type { CourseEntity } from '../../domain/entities/courses'
import type { ICourseRepository } from '../../domain/irepositories/courses'
import { CourseMapper } from '../mappers/courses'
import type { CourseToModel } from '../models/courses'
import { Course } from '../mongooseModels/courses'

export class CourseRepository implements ICourseRepository {
	private static instance: CourseRepository
	private mapper: CourseMapper

	private constructor() {
		this.mapper = new CourseMapper()
	}

	static getInstance() {
		if (!CourseRepository.instance) CourseRepository.instance = new CourseRepository()
		return CourseRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Course, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async delete(id: string): Promise<boolean> {
		const deleteData = await Course.findByIdAndDelete(id)
		return !!deleteData
	}

	async deleteInstitutionCourses(institutionId: string): Promise<boolean> {
		const deleteData = await Course.deleteMany({ institutionId })
		return deleteData.acknowledged
	}

	async deleteDepartmentCourses(departmentId: string): Promise<boolean> {
		const deleteData = await Course.deleteMany({ departmentId })
		return deleteData.acknowledged
	}

	async add(data: CourseToModel) {
		const course = await new Course(data).save()
		return this.mapper.mapFrom(course)!
	}

	async update(id: string, data: Partial<CourseToModel>) {
		const course = await Course.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async find(id: string): Promise<CourseEntity | null> {
		const course = await Course.findById(id)
		return this.mapper.mapFrom(course)
	}
}
