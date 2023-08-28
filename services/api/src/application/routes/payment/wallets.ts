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
		path: '/subscriptions/renewal/toggle',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.toggleRenewSubscription(req)
				}
			})
		]
	}, {
		path: '/transfer',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.transfer(req)
				}
			})
		]
	}, {
		path: '/account/banks/:country',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.getBanks(req)
				}
			})
		]
	}, {
		path: '/account',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.updateAccount(req)
				}
			})
		]
	}, {
		path: '/account/verify',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.verifyAccount(req)
				}
			})
		]
	}, {
		path: '/fund',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.fund(req)
				}
			})
		]
	}, {
		path: '/withdraw',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.withdraw(req)
				}
			})
		]
	}
])