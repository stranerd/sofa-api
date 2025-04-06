import { groupRoutes } from 'equipped'

import { SchedulesController } from '@application/controllers/organizations/schedules'
import { isAuthenticated } from '@application/middlewares'

export const schedulesRoutes = groupRoutes({ path: '/schedules', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: SchedulesController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: SchedulesController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: SchedulesController.create,
	},
	{
		path: '/:id',
		method: 'put',
		handler: SchedulesController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: SchedulesController.delete,
	},
	{
		path: '/:id/start',
		method: 'post',
		handler: SchedulesController.start,
	},
	{
		path: '/:id/end',
		method: 'post',
		handler: SchedulesController.end,
	},
])
