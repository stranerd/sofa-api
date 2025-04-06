import { groupRoutes } from 'equipped'

import { TokenController } from '@application/controllers/auth/token'

export const tokenRoutes = groupRoutes({ path: '/token' }, [
	{
		path: '/',
		method: 'post',
		handler: async (req) => TokenController.getNewTokens(req),
	},
])
