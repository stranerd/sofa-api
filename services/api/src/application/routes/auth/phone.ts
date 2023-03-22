import { PhoneController } from '@application/controllers/auth/phone'
import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const phoneRoutes = groupRoutes('/phone', [
	{
		path: '/verify/text',
		method: 'post',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PhoneController.sendVerificationText(req)
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
					result: await PhoneController.verifyPhone(req)
				}
			})
		]
	}
])