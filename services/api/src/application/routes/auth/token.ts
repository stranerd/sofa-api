import { TokenController } from '@application/controllers/auth/token'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const tokenRoutes = groupRoutes('/token', [
	{
		path: '/',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TokenController.getNewTokens(req)
				}
			})
		]
	}
])