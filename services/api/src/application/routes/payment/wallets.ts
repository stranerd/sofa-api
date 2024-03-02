import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const walletsRoutes = groupRoutes('/wallets', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.get(req))],
	},
	{
		path: '/subscriptions',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.subscribeToPlan(req))],
	},
	{
		path: '/subscriptions/renew',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.renewPlan(req))],
	},
	{
		path: '/subscriptions/renew/toggle',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.toggleRenewSubscription(req))],
	},
	{
		path: '/transfer',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.transfer(req))],
	},
	{
		path: '/account/banks/:country',
		method: 'get',
		controllers: [makeController(async (req) => WalletsController.getBanks(req))],
	},
	{
		path: '/account',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.updateAccount(req))],
	},
	{
		path: '/account/verify',
		method: 'post',
		controllers: [makeController(async (req) => WalletsController.verifyAccount(req))],
	},
	{
		path: '/fund',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.fund(req))],
	},
	{
		path: '/withdraw',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.withdraw(req))],
	},
])
