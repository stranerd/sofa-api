import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

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
