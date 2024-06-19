import { TutorRequestsController } from '@application/controllers/users/tutorRequests'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const tutorRequestsRoutes = groupRoutes({ path: '/tutorRequests', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: TutorRequestsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: TutorRequestsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: TutorRequestsController.create,
	},
	{
		path: '/:id/accept',
		method: 'put',
		middlewares: [isAdmin],
		handler: TutorRequestsController.accept,
	},
])
