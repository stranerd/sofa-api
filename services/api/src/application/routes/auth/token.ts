import { TokenController } from '@application/controllers/auth/token'
import { groupRoutes } from 'equipped'

export const tokenRoutes = groupRoutes({ path: '/token' }, [
	{
		path: '/',
		method: 'post',
		handler: async (req) => TokenController.getNewTokens(req),
	},
])
