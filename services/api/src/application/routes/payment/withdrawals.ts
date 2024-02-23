import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const withdrawalsRoutes = groupRoutes('/withdrawals', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.find(req))],
	},
])
