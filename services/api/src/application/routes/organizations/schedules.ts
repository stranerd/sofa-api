import { SchedulesController } from '@application/controllers/organizations/schedules'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const schedulesRoutes = groupRoutes('/schedules', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => SchedulesController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => SchedulesController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => SchedulesController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => SchedulesController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => SchedulesController.delete(req))],
	},
	{
		path: '/:id/start',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => SchedulesController.start(req))],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => SchedulesController.end(req))],
	},
])
