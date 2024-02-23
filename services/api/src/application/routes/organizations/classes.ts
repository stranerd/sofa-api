import { ClassesController } from '@application/controllers/organizations/classes'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const classesRoutes = groupRoutes('/classes', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => ClassesController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => ClassesController.find(req))],
	},
	{
		path: '/:id/similar',
		method: 'get',
		controllers: [makeController(async (req) => ClassesController.similar(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => ClassesController.update(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ClassesController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ClassesController.delete(req))],
	},
	{
		path: '/:id/purchase',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ClassesController.purchase(req))],
	},
	{
		path: '/:id/purchase',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ClassesController.cancelPurchase(req))],
	},
])
