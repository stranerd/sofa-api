import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const walletsRoutes = groupRoutes({ path: '/wallets' }, [
	{
		path: '/',
		method: 'get',
		middlewares: [isAuthenticated],
		handler: WalletsController.get,
	},
	{
		path: '/subscriptions',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.subscribeToPlan,
	},
	{
		path: '/subscriptions/renew',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.renewPlan,
	},
	{
		path: '/subscriptions/renew/toggle',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.toggleRenewSubscription,
	},
	{
		path: '/transfer',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.transfer,
	},
	{
		path: '/account/banks/:country',
		method: 'get',
		handler: WalletsController.getBanks,
	},
	{
		path: '/account',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.updateAccount,
	},
	{
		path: '/account/verify',
		method: 'post',
		handler: WalletsController.verifyAccount,
	},
	{
		path: '/fund',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.fund,
	},
	{
		path: '/withdraw',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: WalletsController.withdraw,
	},
])
