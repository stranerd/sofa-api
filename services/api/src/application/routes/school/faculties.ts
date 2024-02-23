import { FacultyController } from '@application/controllers/school/faculties'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const facultiesRoutes = groupRoutes('/faculties', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => FacultyController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => FacultyController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => FacultyController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => FacultyController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => FacultyController.delete(req))],
	},
])
