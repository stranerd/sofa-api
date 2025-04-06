import { groupRoutes } from 'equipped'

import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated } from '@application/middlewares'

export const withdrawalsRoutes = groupRoutes({ path: '/withdrawals', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: WithdrawalsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: WithdrawalsController.find,
	},
])
