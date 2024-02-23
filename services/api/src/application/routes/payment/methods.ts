import { MethodsController } from '@application/controllers/payment/methods'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const methodsRoutes = groupRoutes('/methods', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MethodsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MethodsController.find(req))],
	},
	{
		path: '/:id/primary',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => MethodsController.makePrimary(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => MethodsController.delete(req))],
	},
])
