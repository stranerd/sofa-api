import type { QueryParams } from 'equipped'
import { BadRequestError } from 'equipped'

import { appInstance } from '@utils/types'

import type { ICourseRepository } from '../../domain/irepositories/courses'
import type { CourseSections, EmbeddedUser } from '../../domain/types'
import { Coursable, CourseMeta, DraftStatus } from '../../domain/types'
import { CourseMapper } from '../mappers/courses'
import type { CourseFromModel, CourseToModel } from '../models/courses'
import { Course } from '../mongooseModels/courses'
import { File } from '../mongooseModels/files'
import { Quiz } from '../mongooseModels/quizzes'

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

	async add(data: CourseToModel) {
		const course = await new Course(data).save()
		return this.mapper.mapFrom(course)!
	}

	async find(id: string) {
		const course = await Course.findById(id)
		return this.mapper.mapFrom(course)
	}

	async update(id: string, userId: string, data: Partial<CourseToModel>) {
		const course = await Course.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async updateUserBio(user: EmbeddedUser) {
		const courses = await Course.updateMany({ 'user.id': user.id }, { $set: { user } })
		return courses.acknowledged
	}

	async delete(id: string, userId: string) {
		let res = false
		await Course.collection.conn.transaction(async (session) => {
			const courseModel = await Course.findOneAndDelete({ _id: id, 'user.id': userId, status: DraftStatus.draft }, { session })
			if (courseModel) {
				const course = this.mapper.mapFrom(courseModel)!
				await this.#__move(course.id, course.getCoursables(), false, session)
			}
			return (res = !!courseModel)
		})
		return res
	}

	async publish(id: string, userId: string) {
		let res = null as CourseFromModel | null
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findOneAndUpdate(
				{
					_id: id,
					'user.id': userId,
					status: DraftStatus.draft,
				},
				{ $set: { status: DraftStatus.published } },
				{ new: true, session },
			)
			if (!course) throw new BadRequestError('course not found')

			res = course
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async freeze(id: string, userId: string) {
		const course = await Course.findOneAndUpdate(
			{
				_id: id,
				'user.id': userId,
				status: DraftStatus.published,
			},
			{ $set: { frozen: true } },
			{ new: true },
		)
		return this.mapper.mapFrom(course)
	}

	async #__move(courseId: string, data: { id: string; type: Coursable }[], add: boolean, session?: any) {
		await Promise.all(
			data.map(async ({ id: coursableId, type }) => {
				const finder = {
					[Coursable.quiz]: Quiz,
					[Coursable.file]: File,
				}[type as Coursable.file]
				if (!finder) throw new BadRequestError(`unknown type: ${type}`)
				await finder.findByIdAndUpdate(
					coursableId,
					{
						[add ? '$addToSet' : '$pull']: { courseIds: courseId },
					},
					{ session },
				)
			}),
		)
	}

	async move(id: string, data: { id: string; type: Coursable }[], add: boolean) {
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findById(id, null, { session })
			if (add && !course) return
			this.#__move(id, data, add, session)
		})
	}

	async updateSections(id: string, userId: string, sections: CourseSections) {
		const course = await Course.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: { sections } }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async updateMeta(commentId: string, property: CourseMeta, value: 1 | -1) {
		await Course.findByIdAndUpdate(commentId, {
			$inc: { [`meta.${property}`]: value, [`meta.${CourseMeta.total}`]: value },
		})
	}

	async updateRatings(id: string, ratings: number, add: boolean) {
		let res = false
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findById(id, {}, { session })
			if (!course) return res
			course.ratings.total += (add ? 1 : -1) * ratings
			course.ratings.count += add ? 1 : -1
			course.ratings.avg = Number((course.ratings.total / course.ratings.count).toFixed(2))
			res = !!(await course.save({ session }))
			return res
		})
		return res
	}
}
