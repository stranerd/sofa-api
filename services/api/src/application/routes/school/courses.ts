import { CourseController } from '@application/controllers/school/courses'
import { isAdmin, isAuthenticated } from '@application/middlewares'
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
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => CourseController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => CourseController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => CourseController.delete(req))],
	},
])
