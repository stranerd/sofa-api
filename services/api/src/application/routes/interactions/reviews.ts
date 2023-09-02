import { ReviewsController } from '@application/controllers/interactions/reviews'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const reviewsRoutes = groupRoutes('/reviews', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReviewsController.get(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReviewsController.find(req)
				}
			})
		]
	}
])