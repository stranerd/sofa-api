import { PlansController } from '@application/controllers/payment/plans'
import { groupRoutes } from 'equipped'

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
