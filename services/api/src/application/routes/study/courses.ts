import { CourseController } from '@application/controllers/study/courses'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

import { Coursable, QuizModes } from '@modules/study'
import { Course } from '@modules/study/data/mongooseModels/courses'
import { File } from '@modules/study/data/mongooseModels/files'

export const coursesRoutes = groupRoutes('/courses', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => CourseController.get(req))],
	},
	{
		path: '/fix-sections',
		method: 'get',
		controllers: [
			makeController(async () => {
				let result: any
				await Course.collection.conn.transaction(async (session) => {
					const allCourses = await Course.find({}, null, { session })
					const allFiles = await File.find({}, null, { session })
					const filesMap = Object.fromEntries(allFiles.map((file) => [file._id.toString(), file]))

					const bulk = Course.collection.initializeUnorderedBulkOp()
					for (const course of allCourses) {
						const sections = course.sections.map((section) => ({
							...section,
							items: section.items.map((item) => {
								if (['fileType', 'quizMode'].some((key) => key in item)) return item
								if (item.type === Coursable.file && filesMap[item.id]) return { ...item, fileType: filesMap[item.id].type }
								if (item.type === Coursable.quiz) return { ...item, quizMode: QuizModes.practice }
								return item
							}),
						}))
						bulk.find({ _id: course._id }).updateOne({ $set: { sections } })
					}
					result = await bulk.execute({ session })
				})
				return {
					result,
					courses: await Course.find({}),
				}
			}),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => CourseController.find(req))],
	},
	{
		path: '/:id/similar',
		method: 'get',
		controllers: [makeController(async (req) => CourseController.similar(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.update(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.delete(req))],
	},
	{
		path: '/:id/publish',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.publish(req))],
	},
	{
		path: '/:id/freeze',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.freeze(req))],
	},
	{
		path: '/:id/move',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.move(req))],
	},
	{
		path: '/:id/sections',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CourseController.updateSections(req))],
	},
])
