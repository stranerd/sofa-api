import { TutorRequestsController } from '@application/controllers/users/tutorRequests'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const tutorRequestsRoutes = groupRoutes('/tutorRequests', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TutorRequestsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TutorRequestsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TutorRequestsController.create(req))],
	},
	{
		path: '/:id/accept',
		method: 'put',
		controllers: [isAdmin, makeController(async (req) => TutorRequestsController.accept(req))],
	},
])
