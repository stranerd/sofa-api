import { groupRoutes, makeController, StatusCodes } from 'equipped'
import { EmailsController } from '@application/controllers/auth/emails'
import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'

export const emailRoutes = groupRoutes('/emails', [
	{
		path: '/signin',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EmailsController.signin(req)
				}
			})
		]
	}, {
		path: '/signup',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EmailsController.signup(req)
				}
			})
		]
	}, {
		path: '/verify/mail',
		method: 'post',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EmailsController.sendVerificationMail(req)
				}
			})
		]
	}, {
		path: '/verify',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EmailsController.verifyEmail(req)
				}
			})
		]
	}
])