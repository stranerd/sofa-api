import { PurchasesController } from '@application/controllers/payment/purchases'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const purchasesRoutes = groupRoutes({ path: '/purchases', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: PurchasesController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: PurchasesController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: PurchasesController.create,
	},
])
