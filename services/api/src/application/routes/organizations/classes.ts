import { groupRoutes } from 'equipped'

import { ClassesController } from '@application/controllers/organizations/classes'
import { isAuthenticated } from '@application/middlewares'

export const classesRoutes = groupRoutes({ path: '/classes' }, [
	{
		path: '/',
		method: 'get',
		handler: async (req) => ClassesController.get(req, false),
	},
	{
		path: '/:id',
		method: 'get',
		handler: ClassesController.find,
	},
	{
		path: '/:id/similar',
		method: 'get',
		handler: ClassesController.similar,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: ClassesController.update,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: ClassesController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: ClassesController.delete,
	},
	{
		path: '/:id/purchase',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: ClassesController.purchase,
	},
	{
		path: '/:id/purchase',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: ClassesController.cancelPurchase,
	},
])
