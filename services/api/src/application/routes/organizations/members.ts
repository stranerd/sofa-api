import { MembersController } from '@application/controllers/organizations/members'
import { isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const membersRoutes = groupRoutes('/members', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.get(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.add(req)
				}
			})
		]
	}, {
		path: '/request',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.request(req)
				}
			})
		]
	}, {
		path: '/accept',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.accept(req)
				}
			})
		]
	}, {
		path: '/leave',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.leave(req)
				}
			})
		]
	}, {
		path: '/remove',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MembersController.remove(req)
				}
			})
		]
	}
])