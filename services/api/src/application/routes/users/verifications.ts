import { VerificationsController } from '@application/controllers/users/verifications'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const verificationsRoutes = groupRoutes('/verifications', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => VerificationsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => VerificationsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => VerificationsController.create(req))],
	},
	{
		path: '/:id/accept',
		method: 'put',
		controllers: [isAdmin, makeController(async (req) => VerificationsController.accept(req))],
	},
])
