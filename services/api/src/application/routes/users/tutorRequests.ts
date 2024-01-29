import { TutorRequestsController } from '@application/controllers/users/tutorRequests'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const tutorRequestsRoutes = groupRoutes('/tutorRequests', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TutorRequestsController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TutorRequestsController.find(req),
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
				result: await TutorRequestsController.create(req),
			})),
		],
	},
	{
		path: '/:id/accept',
		method: 'put',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TutorRequestsController.accept(req),
			})),
		],
	},
])
