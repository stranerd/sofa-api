import { LikesController } from '@application/controllers/interactions/likes'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const likesRoutes = groupRoutes({ path: '/likes', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: LikesController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: LikesController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: LikesController.create,
	},
])
