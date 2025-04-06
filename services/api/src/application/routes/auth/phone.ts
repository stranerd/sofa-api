import { groupRoutes } from 'equipped'

import { PhoneController } from '@application/controllers/auth/phone'
import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'

export const phoneRoutes = groupRoutes({ path: '/phone' }, [
	{
		path: '/verify/text',
		method: 'post',
		middlewares: [isAuthenticatedButIgnoreVerified],
		handler: async (req) => PhoneController.sendVerificationText(req),
	},
	{
		path: '/verify',
		method: 'post',
		handler: async (req) => PhoneController.verifyPhone(req),
	},
])
