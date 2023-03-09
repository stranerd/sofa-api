import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const transactionsRoutes = groupRoutes('/transactions', [
	{
		path: '/flutterwave/secrets',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.getSecrets(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.get(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.find(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.create(req)
				}
			})
		]
	}, {
		path: '/:id/fulfill',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.fulfill(req)
				}
			})
		]
	}
])