import { PlansController } from '@application/controllers/payment/plans'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const plansRoutes = groupRoutes('/plans', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await PlansController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await PlansController.find(req),
			})),
		],
	},
])
