import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { ICourseRepository } from '../../domain/irepositories/courses'
import { Coursable, CourseMeta, CourseSections, DraftStatus, EmbeddedUser } from '../../domain/types'
import { compareArrayContents } from '../../utils'
import { CourseMapper } from '../mappers/courses'
import { CourseFromModel, CourseToModel } from '../models/courses'
import { Course } from '../mongooseModels/courses'
import { File } from '../mongooseModels/files'
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
		let res = null as CourseFromModel | null
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findOneAndUpdate({
				_id: id, 'user.id': userId
			}, { $set: data }, { new: true, session })
			if (!course) throw new Error('course not found')

			const updatedData = { topicId: course.topicId, tagIds: course.tagIds }
			await Promise.all([
				Quiz.updateMany({ courseId: id }, { $set: updatedData }, { session }),
				File.updateMany({ courseId: id }, { $set: updatedData }, { session })
			])

			res = course
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async updateUserBio (user: EmbeddedUser) {
		const courses = await Course.updateMany({ 'user.id': user.id }, { $set: { user } })
		return courses.acknowledged
	}

	async delete (id: string, userId: string) {
		let res = false
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findOneAndDelete({ _id: id, 'user.id': userId, status: DraftStatus.draft }, { session })
			if (course) await Promise.all([
				Quiz.deleteMany({ courseId: id }, { session }),
				File.deleteMany({ courseId: id }, { session }),
			])
			return res = !!course
		})
		return res
	}

	async publish (id: string, userId: string) {
		let res = null as CourseFromModel | null
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findOneAndUpdate({
				_id: id, 'user.id': userId, status: DraftStatus.draft
			}, { $set: { status: DraftStatus.published } }, { new: true, session })
			if (!course) throw new Error('course not found')

			await Promise.all([
				Quiz.updateMany({ courseId: id }, { $set: { status: DraftStatus.published } }, { session }),
				File.updateMany({ courseId: id }, { $set: { status: DraftStatus.published } }, { session })
			])

			res = course
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async freeze (id: string, userId: string) {
		const course = await Course.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.published
		}, { $set: { frozen: true } }, { new: true })
		return this.mapper.mapFrom(course)
	}

	async move (id: string, coursableId: string, type: Coursable, userId: string, add: boolean) {
		let res = null as CourseFromModel | null
		const finder = {
			[Coursable.quiz]: Quiz,
			[Coursable.file]: File
		}[type as Coursable.file]
		await Course.collection.conn.transaction(async (session) => {
			if (!finder) throw new Error(`unknown type: ${type}`)
			const [course, coursable] = await Promise.all([
				Course.findById(id, null, { session }),
				finder.findById(coursableId, null, { session })
			])
			if (!course || course.user.id !== userId) return
			let sections = course.sections
			if (add) {
				if (!coursable) throw new Error(`${type} not found`)
				if (coursable.user.id !== userId) return
				if (coursable.courseId !== null) throw new Error(`${type} already in a course`)
			} else {
				if (course.status !== DraftStatus.draft) throw new Error(`cannot remove ${type} from published course`)
				sections = sections.map((s) => {
					s.items = s.items.filter((i) => !(i.id === coursableId && i.type === type))
					return s
				})
			}
			if (coursable) await finder.findByIdAndUpdate(coursableId, {
				$set: {
					...(add ? { topicId: course.topicId, courseId: course.id } : { courseId: null }),
					status: course.status
				}
			}, { session })
			res = await Course.findByIdAndUpdate(course.id, {
				$set: { sections },
				[add ? '$addToSet' : '$pull']: { coursables: { id: coursableId, type } }
			}, { session, new: true })
		})
		return this.mapper.mapFrom(res)
	}

	async updateSections (id: string, userId: string, sections: CourseSections) {
		let res = null as CourseFromModel | null
		await Course.collection.conn.transaction(async (session) => {
			const course = await Course.findById(id, null, { session })
			if (!course || course.user.id !== userId) return
			const secs = [...new Set(sections.map((s) => s.items)
				.flat()
				.map((s) => `${s.type}:${s.id}`))]
			const coursables = course.coursables.map((c) => `${c.type}:${c.id}`)
			if (!compareArrayContents(secs, coursables)) throw new Error('all items in the coursables list must appear in a section')
			res = await Course.findByIdAndUpdate(course.id, { $set: { sections } }, { session, new: true })
		})
		return this.mapper.mapFrom(res)
	}

	async updateMeta (commentId: string, property: CourseMeta, value: 1 | -1) {
		await Course.findByIdAndUpdate(commentId, {
			$inc: { [`meta.${property}`]: value, [`meta.${CourseMeta.total}`]: value }
		})
	}

	async updateRatings (id: string, ratings: number, add: boolean) {
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