import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IClassRepository } from '../../domain/irepositories/classes'
import { ClassLesson, ClassLessonInput, ClassMembers, EmbeddedUser, LessonMembers } from '../../domain/types'
import { ClassMapper } from '../mappers/classes'
import { ClassToModel } from '../models/classes'
import { Class } from '../mongooseModels/classes'

export class ClassRepository implements IClassRepository {
	private static instance: ClassRepository
	private mapper: ClassMapper

	private constructor() {
		this.mapper = new ClassMapper()
	}

	static getInstance() {
		if (!ClassRepository.instance) ClassRepository.instance = new ClassRepository()
		return ClassRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Class, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: ClassToModel) {
		const classInst = await new Class(data).save()
		return this.mapper.mapFrom(classInst)!
	}

	async find(id: string) {
		const classIns = await Class.findById(id)
		return this.mapper.mapFrom(classIns)
	}

	async update(organizationId: string, id: string, data: Partial<ClassToModel>) {
		const classIns = await Class.findOneAndUpdate(
			{
				_id: id,
				organizationId,
			},
			{ $set: data },
			{ new: true },
		)
		return this.mapper.mapFrom(classIns)
	}

	async updateUserBio(user: EmbeddedUser) {
		const classes = await Class.updateMany({ 'user.id': user.id }, { $set: { user } })
		return classes.acknowledged
	}

	async delete(organizationId: string, id: string) {
		const classIns = await Class.findOneAndDelete({ _id: id, organizationId })
		return !!classIns
	}

	async addLesson(organizationId: string, classId: string, data: ClassLessonInput) {
		const lesson: ClassLesson = {
			id: appInstance.dbs.mongo.Id.toString(),
			title: data.title,
			curriculum: [],
			users: {
				students: [],
				teachers: data.teachers,
			},
		}
		const classInst = await Class.findOneAndUpdate({ organizationId, _id: classId }, { $push: { lessons: lesson } }, { new: true })
		return this.mapper.mapFrom(classInst)
	}

	async updateLesson(organizationId: string, classId: string, lessonId: string, data: ClassLessonInput) {
		const classInst = await Class.findOneAndUpdate(
			{ organizationId, _id: classId, 'lessons.id': lessonId },
			{
				$set: {
					[`lessons.$.title`]: data.title,
					[`lessons.$.users.teachers`]: data.teachers,
				},
			},
			{ new: true },
		)
		return this.mapper.mapFrom(classInst)
	}

	async deleteLesson(organizationId: string, classId: string, lessonId: string) {
		const classInst = await Class.findOneAndUpdate(
			{ organizationId, _id: classId, 'lessons.id': lessonId },
			{ $pull: { lessons: { id: lessonId } } },
			{ new: true },
		)
		return this.mapper.mapFrom(classInst)
	}

	async manageMembers({
		organizationId,
		classId,
		userIds,
		type,
		add,
	}: {
		organizationId: string
		classId: string
		userIds: string[]
		type: keyof ClassMembers
		add: boolean
	}) {
		const classInst = await Class.findOneAndUpdate(
			{ organizationId, _id: classId },
			{ [add ? '$addToSet' : '$pull']: { [`members.${type}`]: { [add ? '$each' : '$in']: userIds } } },
			{ new: true },
		)
		return this.mapper.mapFrom(classInst)
	}

	async manageLessonUsers({
		organizationId,
		classId,
		lessonId,
		userIds,
		type,
		add,
	}: {
		organizationId: string
		classId: string
		lessonId: string
		userIds: string[]
		type: keyof LessonMembers
		add: boolean
	}) {
		const classInst = await Class.findOneAndUpdate(
			{ organizationId, _id: classId, 'lessons.id': lessonId },
			{ [add ? '$addToSet' : '$pull']: { [`lessons.$.users.${type}`]: { [add ? '$each' : '$in']: userIds } } },
			{ new: true },
		)
		return this.mapper.mapFrom(classInst)
	}

	async updateLessonCurriculum({
		organizationId,
		classId,
		lessonId,
		curriculum,
	}: {
		organizationId: string
		classId: string
		lessonId: string
		curriculum: ClassLesson['curriculum']
	}) {
		const classInst = await Class.findOneAndUpdate(
			{ organizationId, _id: classId, 'lessons.id': lessonId },
			{ $set: { 'lessons.$.curriculum': curriculum } },
			{ new: true },
		)
		return this.mapper.mapFrom(classInst)
	}
}
