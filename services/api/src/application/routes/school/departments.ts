import { DepartmentController } from '@application/controllers/school/departments'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const departmentsRoutes = groupRoutes({ path: '/departments' }, [
	{
		path: '/',
		method: 'get',
		handler: DepartmentController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: DepartmentController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated, isAdmin],
		handler: DepartmentController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated, isAdmin],
		handler: DepartmentController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated, isAdmin],
		handler: DepartmentController.delete,
	},
])
