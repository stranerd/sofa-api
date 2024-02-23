import { IdentitiesController } from '@application/controllers/auth/identities'
import { groupRoutes, makeController } from 'equipped'

export const identitiesRoutes = groupRoutes('/identities', [
	{
		path: '/google',
		method: 'post',
		controllers: [makeController(async (req) => IdentitiesController.googleSignIn(req))],
	},
	{
		path: '/apple',
		method: 'post',
		controllers: [makeController(async (req) => IdentitiesController.appleSignIn(req))],
	},
])
