import { UserController } from '@application/controllers/auth/user'
import { groupRoutes } from 'equipped'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

export const userRoutes = groupRoutes({ path: '/user' }, [
	{
		path: '/',
		method: 'get',
		handler: async (req) => UserController.find(req),
		middlewares: [isAuthenticatedButIgnoreVerified],
	},
	{
		path: '/',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: async (req) => UserController.update(req),
	},
	{
		path: '/roles',
		method: 'post',
		middlewares: [isAuthenticated, isAdmin],
		handler: async (req) => UserController.updateRole(req),
	},
	{
		path: '/signout',
		method: 'post',
		handler: async (req) => UserController.signout(req),
	},
	{
		path: '/superAdmin',
		method: 'get',
		handler: async (req) => UserController.superAdmin(req),
	},
	{
		path: '/officialAccount',
		method: 'get',
		handler: async (req) => UserController.officialAccount(req),
	},
	{
		path: '/',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: async (req) => UserController.delete(req),
	},
])
