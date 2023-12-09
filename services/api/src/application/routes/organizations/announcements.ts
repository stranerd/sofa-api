import { AnnouncementController } from '@application/controllers/organizations/announcements'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const announcementsRoutes = groupRoutes('/announcements', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnnouncementController.get(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnnouncementController.find(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnnouncementController.create(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnnouncementController.delete(req)
				}
			})
		]
	}, {
		path: '/read',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnnouncementController.markRead(req)
				}
			})
		]
	}
])