import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const transactionsRoutes = groupRoutes({ path: '/transactions' }, [
	{
		path: '/flutterwave/secrets',
		method: 'get',
		handler: TransactionsController.getSecrets,
	},
	{
		path: '/',
		method: 'get',
		middlewares: [isAuthenticated],
		handler: TransactionsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		middlewares: [isAuthenticated],
		handler: TransactionsController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: TransactionsController.create,
	},
	{
		path: '/:id/fulfill',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: TransactionsController.fulfill,
	},
])
