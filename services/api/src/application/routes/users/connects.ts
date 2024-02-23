import { ConnectsController } from '@application/controllers/users/connects'
import { isAuthenticated, isSubscribed } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const connectsRoutes = groupRoutes('/connects', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ConnectsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ConnectsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isSubscribed, makeController(async (req) => ConnectsController.create(req))],
	},
	{
		path: '/:id/accept',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => ConnectsController.accept(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ConnectsController.delete(req))],
	},
])
