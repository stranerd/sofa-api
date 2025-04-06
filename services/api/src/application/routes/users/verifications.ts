import { groupRoutes } from 'equipped'

import { VerificationsController } from '@application/controllers/users/verifications'
import { isAdmin, isAuthenticated } from '@application/middlewares'

export const verificationsRoutes = groupRoutes({ path: '/verifications', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: VerificationsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: VerificationsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: VerificationsController.create,
	},
	{
		path: '/:id/accept',
		method: 'put',
		middlewares: [isAdmin],
		handler: VerificationsController.accept,
	},
])
