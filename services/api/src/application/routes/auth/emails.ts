import { EmailsController } from '@application/controllers/auth/emails'
import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const emailRoutes = groupRoutes({ path: '/emails' }, [
	{
		path: '/signin',
		method: 'post',
		handler: async (req) => EmailsController.signin(req),
	},
	{
		path: '/signup',
		method: 'post',
		handler: async (req) => EmailsController.signup(req),
	},
	{
		path: '/verify/mail',
		method: 'post',
		middlewares: [isAuthenticatedButIgnoreVerified],
		handler: async (req) => EmailsController.sendVerificationMail(req),
	},
	{
		path: '/verify',
		method: 'post',
		handler: async (req) => EmailsController.verifyEmail(req),
	},
])
