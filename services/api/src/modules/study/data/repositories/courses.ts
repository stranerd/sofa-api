import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ICourseRepository } from '../../domain/irepositories/courses'
import { Coursable, DraftStatus, EmbeddedUser } from '../../domain/types'
import { CourseMapper } from '../mappers/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'
import { Course } from '../mongooseModels/courses'
import { Quiz } from '../mongooseModels/quizzes'

export class CourseRepository implements ICourseRepository {
	private static instance: CourseRepository
	private mapper: CourseMapper

	private constructor () {
		this.mapper = new CourseMapper()
	}

	static getInstance () {
		if (!CourseRepository.instance) CourseRepository.instance = new CourseRepository()
		return CourseRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Course, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: CourseToModel) {
		const course = await new Course(data).save()
		return this.mapper.mapFrom(course)!
	}

	async find (id: string) {
		const course = await Course.findById(id)
		return this.mapper.mapFrom(course)
	}

	async update (id: string, userId: string, data: Partial<CourseToModel>) {
		const course = await Course.findOneAndUpdate({
			_id: id, 'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async updateUserBio (user: EmbeddedUser) {
		const courses = await Course.updateMany({ 'user.id': user.id }, { $set: { user } })
		return courses.acknowledged
	}

	async delete (id: string, userId: string) {
		const course = await Course.findOneAndDelete({ _id: id, 'user.id': userId, status: DraftStatus.draft })
		return !!course
	}

	async publish (id: string, userId: string) {
		const course = await Course.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.draft
		}, { $set: { status: DraftStatus.published } }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async freeze (id: string, userId: string) {
		const course = await Course.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.published
		}, { $set: { status: DraftStatus.frozen } }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async move (id: string, coursableId: string, type: Coursable, userId: string, add: boolean) {
		let res = null as CourseFromModel | null
		const finder = {
			[Coursable.quiz]: Quiz
		}[type]
		await Course.collection.conn.transaction(async (session) => {
			if (!finder) return
			const [course, coursable] = await Promise.all([
				Course.findById(id, null, { session }),
				finder.findById(coursableId, null, { session })
			])
			if (!course || !coursable) return
			if (course.user.id !== userId || coursable.user.id !== userId) return
			if (add && coursable.courseId !== null) return
			if (!add && course.status !== DraftStatus.draft) return
			await finder.findByIdAndUpdate(coursable.id, {
				$set: { courseId: course.id, status: DraftStatus.draft }
			}, { session })
			res = await Course.findByIdAndUpdate(course.id, {
				[add ? '$addToSet' : '$pull']: { coursables: { id: coursable.id, type } }
			}, { session, new: true })
		})
		return this.mapper.mapFrom(res)
	}
}