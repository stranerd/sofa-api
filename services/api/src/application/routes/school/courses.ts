import { CourseController } from '@application/controllers/school/courses'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

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
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated, isAdmin],
		handler: CourseController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated, isAdmin],
		handler: CourseController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated, isAdmin],
		handler: CourseController.delete,
	},
])
