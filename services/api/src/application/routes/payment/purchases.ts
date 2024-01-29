import { PurchasesController } from '@application/controllers/payment/purchases'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const purchasesRoutes = groupRoutes('/purchases', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await PurchasesController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await PurchasesController.find(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await PurchasesController.create(req),
			})),
		],
	},
])
