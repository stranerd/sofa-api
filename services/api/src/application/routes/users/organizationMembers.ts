import { OrganizationMembersController } from '@application/controllers/users/organizationMembers'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const organizationMembersRoutes = groupRoutes('/organizationMembers', [
	{
		path: '/:organizationId',
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
		path: '/:organizationId/:email',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await OrganizationMembersController.find(req)
				}
			})
		]
	}
])