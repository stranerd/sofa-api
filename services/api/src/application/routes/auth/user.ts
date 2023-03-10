import { UserController } from '@application/controllers/auth/user'
import { groupRoutes, makeController, StatusCodes } from 'equipped'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

export const userRoutes = groupRoutes('/user', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.find(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.update(req)
				}
			})
		]
	}, {
		path: '/roles',
		method: 'post',
		controllers: [
			isAuthenticated, isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.updateRole(req)
				}

			})
		]
	}, {
		path: '/signout',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.signout(req)
				}
			})
		]
	}, {
		path: '/superAdmin',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.superAdmin(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UserController.delete(req)
				}
			})
		]
	}
])