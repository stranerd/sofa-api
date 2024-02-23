import { PasswordsController } from '@application/controllers/auth/passwords'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const passwordsRoutes = groupRoutes('/passwords', [
	{
		path: '/reset/mail',
		method: 'post',
		controllers: [makeController(async (req) => PasswordsController.sendResetMail(req))],
	},
	{
		path: '/reset',
		method: 'post',
		controllers: [makeController(async (req) => PasswordsController.resetPassword(req))],
	},
	{
		path: '/update',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PasswordsController.updatePassword(req))],
	},
])
