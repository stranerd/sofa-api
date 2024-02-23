import { TokenController } from '@application/controllers/auth/token'
import { groupRoutes, makeController } from 'equipped'

export const tokenRoutes = groupRoutes('/token', [
	{
		path: '/',
		method: 'post',
		controllers: [makeController(async (req) => TokenController.getNewTokens(req))],
	},
])
