import { CourseController } from '@application/controllers/study/courses'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const coursesRoutes = groupRoutes('/courses', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => CourseController.get(req))],
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
