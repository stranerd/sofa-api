import { PlansController } from '@application/controllers/payment/plans'
import { groupRoutes, makeController } from 'equipped'

export const plansRoutes = groupRoutes('/plans', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => PlansController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => PlansController.find(req))],
	},
])
