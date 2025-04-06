import { groupRoutes } from 'equipped'

import { AnnouncementsController } from '@application/controllers/organizations/announcements'
import { isAuthenticated } from '@application/middlewares'

export const announcementsRoutes = groupRoutes({ path: '/announcements', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: AnnouncementsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: AnnouncementsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: AnnouncementsController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: AnnouncementsController.delete,
	},
	{
		path: '/read',
		method: 'post',
		handler: AnnouncementsController.markRead,
	},
])
