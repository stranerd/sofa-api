import { PurchasesController } from '@application/controllers/payment/purchases'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const purchasesRoutes = groupRoutes('/purchases', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => PurchasesController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => PurchasesController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PurchasesController.create(req))],
	},
])
