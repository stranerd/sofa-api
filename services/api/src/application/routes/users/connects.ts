import { ConnectsController } from '@application/controllers/users/connects'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const connectsRoutes = groupRoutes({ path: '/connects', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ConnectsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ConnectsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: ConnectsController.create,
	},
	{
		path: '/:id/accept',
		method: 'put',
		handler: ConnectsController.accept,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: ConnectsController.delete,
	},
])
