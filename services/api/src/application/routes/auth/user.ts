import { UserController } from '@application/controllers/auth/user'
import { groupRoutes, makeController } from 'equipped'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

export const userRoutes = groupRoutes('/user', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticatedButIgnoreVerified, makeController(async (req) => UserController.find(req))],
	},
	{
		path: '/',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => UserController.update(req))],
	},
	{
		path: '/roles',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => UserController.updateRole(req))],
	},
	{
		path: '/signout',
		method: 'post',
		controllers: [makeController(async (req) => UserController.signout(req))],
	},
	{
		path: '/superAdmin',
		method: 'get',
		controllers: [makeController(async (req) => UserController.superAdmin(req))],
	},
	{
		path: '/officialAccount',
		method: 'get',
		controllers: [makeController(async (req) => UserController.officialAccount(req))],
	},
	{
		path: '/',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => UserController.delete(req))],
	},
])
