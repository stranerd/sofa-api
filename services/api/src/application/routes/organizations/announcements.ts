import { AnnouncementsController } from '@application/controllers/organizations/announcements'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const announcementsRoutes = groupRoutes('/announcements', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await AnnouncementsController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await AnnouncementsController.find(req),
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
				result: await AnnouncementsController.create(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await AnnouncementsController.delete(req),
			})),
		],
	},
	{
		path: '/read',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await AnnouncementsController.markRead(req),
			})),
		],
	},
])
