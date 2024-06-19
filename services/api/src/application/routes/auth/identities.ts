import { IdentitiesController } from '@application/controllers/auth/identities'
import { groupRoutes } from 'equipped'

export const identitiesRoutes = groupRoutes({ path: '/identities' }, [
	{
		path: '/google',
		method: 'post',
		handler: async (req) => IdentitiesController.googleSignIn(req),
	},
	{
		path: '/apple',
		method: 'post',
		handler: async (req) => IdentitiesController.appleSignIn(req),
	},
])
