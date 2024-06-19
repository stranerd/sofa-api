import { ReviewsController } from '@application/controllers/interactions/reviews'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const reviewsRoutes = groupRoutes({ path: '/reviews' }, [
	{
		path: '/',
		method: 'get',
		handler: ReviewsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ReviewsController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: ReviewsController.add,
	},
])
