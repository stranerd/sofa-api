import { ClassesController } from '@application/controllers/organizations/classes'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const classesRoutes = groupRoutes('/classes', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.find(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.update(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.create(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.delete(req),
			})),
		],
	},
	{
		path: '/:id/purchase',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.purchase(req),
			})),
		],
	},
	{
		path: '/:id/purchase',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.cancelPurchase(req),
			})),
		],
	},
])
