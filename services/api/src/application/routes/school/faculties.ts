import { FacultyController } from '@application/controllers/school/faculties'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const facultiesRoutes = groupRoutes('/faculties', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await FacultyController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await FacultyController.find(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await FacultyController.create(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await FacultyController.update(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await FacultyController.delete(req),
			})),
		],
	},
])
