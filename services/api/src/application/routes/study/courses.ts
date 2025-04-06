import { groupRoutes } from 'equipped'

import { CourseController } from '@application/controllers/study/courses'
import { isAuthenticated } from '@application/middlewares'

export const coursesRoutes = groupRoutes({ path: '/courses' }, [
	{
		path: '/',
		method: 'get',
		handler: CourseController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: CourseController.find,
	},
	{
		path: '/:id/similar',
		method: 'get',
		handler: CourseController.similar,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: CourseController.update,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: CourseController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: CourseController.delete,
	},
	{
		path: '/:id/publish',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: CourseController.publish,
	},
	{
		path: '/:id/freeze',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: CourseController.freeze,
	},
	{
		path: '/:id/sections',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: CourseController.updateSections,
	},
])
