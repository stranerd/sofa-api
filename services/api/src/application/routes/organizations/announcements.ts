import { AnnouncementsController } from '@application/controllers/organizations/announcements'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const announcementsRoutes = groupRoutes('/announcements', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => AnnouncementsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => AnnouncementsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => AnnouncementsController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => AnnouncementsController.delete(req))],
	},
	{
		path: '/read',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => AnnouncementsController.markRead(req))],
	},
])
