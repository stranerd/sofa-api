import { groupRoutes } from 'equipped'

import { ViewsController } from '@application/controllers/interactions/views'
import { isAuthenticated } from '@application/middlewares'

export const viewsRoutes = groupRoutes({ path: '/views', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ViewsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ViewsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: ViewsController.create,
	},
])
