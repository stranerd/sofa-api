import { DepartmentController } from '@application/controllers/school/departments'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const departmentsRoutes = groupRoutes('/departments', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => DepartmentController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => DepartmentController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => DepartmentController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => DepartmentController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => DepartmentController.delete(req))],
	},
])
