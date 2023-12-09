import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ILessonRepository } from '../../domain/irepositories/lessons'
import { LessonMembers } from '../../domain/types'
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

	async update (organizationId: string, classId: string, id: string, data: Partial<LessonToModel>) {
		const lesson = await Lesson.findOneAndUpdate({ _id: id, organizationId, classId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(lesson)
	}

	async delete (organizationId: string, classId: string, id: string) {
		const lesson = await Lesson.findOneAndDelete({ _id: id, organizationId, classId })
		return !!lesson
	}

	async deleteClassLessons (organizationId: string, classId: string) {
		const lessons = await Lesson.deleteMany({ organizationId, classId })
		return lessons.acknowledged
	}

	async manageUsers ({ organizationId, classId, id, userIds, type, add }: {
		organizationId: string, classId: string, id: string, userIds: string[], type: keyof LessonMembers, add: boolean
	}) {
		const lesson = await Lesson.findOneAndUpdate(
			{ _id: id, organizationId, classId },
			{ [add ? '$addToSet' : '$pull']: { [`users.${type}`]: { [add ? '$each' : '$in']: userIds } } },
			{ new: true }
		)
		return this.mapper.mapFrom(lesson)
	}
}
