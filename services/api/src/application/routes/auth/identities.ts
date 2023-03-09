import { IdentitiesController } from '@application/controllers/auth/identities'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const identitiesRoutes = groupRoutes('/identities', [
	{
		path: '/google',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await IdentitiesController.googleSignIn(req)
				}
			})
		]
	}, {
		path: '/apple',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await IdentitiesController.appleSignIn(req)
				}
			})
		]
	}
])