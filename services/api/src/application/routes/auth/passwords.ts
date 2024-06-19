import { PasswordsController } from '@application/controllers/auth/passwords'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const passwordsRoutes = groupRoutes({ path: '/passwords' }, [
	{
		path: '/reset/mail',
		method: 'post',
		handler: async (req) => PasswordsController.sendResetMail(req),
	},
	{
		path: '/reset',
		method: 'post',
		handler: async (req) => PasswordsController.resetPassword(req),
	},
	{
		path: '/update',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: async (req) => PasswordsController.updatePassword(req),
	},
])
