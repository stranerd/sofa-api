import { groupRoutes } from 'equipped'

import { PlansController } from '@application/controllers/payment/plans'

export const plansRoutes = groupRoutes({ path: '/plans' }, [
	{
		path: '/',
		method: 'get',
		handler: PlansController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: PlansController.find,
	},
])
