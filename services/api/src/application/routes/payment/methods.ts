import { groupRoutes } from 'equipped'

import { MethodsController } from '@application/controllers/payment/methods'
import { isAuthenticated } from '@application/middlewares'

export const methodsRoutes = groupRoutes({ path: '/methods', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: MethodsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: MethodsController.find,
	},
	{
		path: '/:id/primary',
		method: 'put',
		handler: MethodsController.makePrimary,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: MethodsController.delete,
	},
])
