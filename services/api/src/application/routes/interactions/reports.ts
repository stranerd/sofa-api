import { groupRoutes } from 'equipped'

import { ReportController } from '@application/controllers/interactions/reports'
import { isAdmin, isAuthenticated } from '@application/middlewares'

export const reportsRoutes = groupRoutes({ path: '/reports', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ReportController.get,
		middlewares: [isAdmin],
	},
	{
		path: '/:id',
		method: 'get',
		handler: ReportController.find,
		middlewares: [isAdmin],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: ReportController.delete,
		middlewares: [isAdmin],
	},
	{
		path: '/',
		method: 'post',
		handler: ReportController.create,
	},
])
