import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const walletsRoutes = groupRoutes('/wallets', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.get(req)
				}
			})
		]
	}, {
		path: '/subscriptions',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.subscribeToPlan(req)
				}
			})
		]
	}, {
		path: '/subscriptions',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.cancelSubscription(req)
				}
			})
		]
	}
])