import { groupRoutes } from 'equipped'

import { NotificationsController } from '@application/controllers/notifications/notifications'
import { isAuthenticated } from '@application/middlewares'

export const notificationsRoutes = groupRoutes({ path: '/notifications', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: NotificationsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: NotificationsController.find,
	},
	{
		path: '/seen',
		method: 'put',
		handler: NotificationsController.markAllSeen,
	},
	{
		path: '/:id/seen',
		method: 'put',
		handler: NotificationsController.markSeen,
	},
])
