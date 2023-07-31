import { UsersController } from '@application/controllers/users/users'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const usersRoutes = groupRoutes('/users', [
	{
		path: '/type',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateType(req)
				}
			})
		]
	}, {
		path: '/organization/code',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateOrgCode(req)
				}
			})
		]
	}, {
		path: '/ai',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateAi(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.get(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.find(req)
				}
			})
		]
	}, {
		path: '/socials',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateSocials(req)
				}
			})
		]
	}, {
		path: '/location',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateLocation(req)
				}
			})
		]
	}
])