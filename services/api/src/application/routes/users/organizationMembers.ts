import { OrganizationMembersController } from '@application/controllers/users/organizationMembers'
import { isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const organizationMembersRoutes = groupRoutes('/organizationMembers/:organizationalId', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrganizationMembersController.get(req)
				}
			})
		]
	}, {
		path: '/:email',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrganizationMembersController.find(req)
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
					result: await OrganizationMembersController.add(req)
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
					result: await OrganizationMembersController.request(req)
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
					result: await OrganizationMembersController.accept(req)
				}
			})
		]
	}, {
		path: '/leave',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrganizationMembersController.leave(req)
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
					result: await OrganizationMembersController.remove(req)
				}
			})
		]
	}
])