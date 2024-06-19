import { FacultyController } from '@application/controllers/school/faculties'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const facultiesRoutes = groupRoutes({ path: '/faculties' }, [
	{
		path: '/',
		method: 'get',
		handler: FacultyController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: FacultyController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated, isAdmin],
		handler: FacultyController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated, isAdmin],
		handler: FacultyController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated, isAdmin],
		handler: FacultyController.delete,
	},
])
