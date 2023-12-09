import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ILessonRepository } from '../../domain/irepositories/lessons'
import { LessonMapper } from '../mappers/lessons'
import { LessonToModel } from '../models/lessons'
import { Lesson } from '../mongooseModels/lessons'

export class LessonRepository implements ILessonRepository {
	private static instance: LessonRepository
	private mapper: LessonMapper

	private constructor () {
		this.mapper = new LessonMapper()
	}

	static getInstance () {
		if (!LessonRepository.instance) LessonRepository.instance = new LessonRepository()
		return LessonRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Lesson, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: LessonToModel) {
		const lesson = await new Lesson(data).save()
		return this.mapper.mapFrom(lesson)!
	}

	async find (id: string) {
		const lesson = await Lesson.findById(id)
		return this.mapper.mapFrom(lesson)
	}

	async update (id: string, organizationId: string, classId: string, data: Partial<LessonToModel>) {
		const lesson = await Lesson.findOneAndUpdate({ _id: id, organizationId, classId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(lesson)
	}

	async delete (id: string, organizationId: string, classId: string) {
		const lesson = await Lesson.findOneAndDelete({ _id: id, organizationId, classId })
		return !!lesson
	}

	async deleteClassLessons (organizationId: string, classId: string) {
		const lessons = await Lesson.deleteMany({ organizationId, classId })
		return lessons.acknowledged
	}
}
