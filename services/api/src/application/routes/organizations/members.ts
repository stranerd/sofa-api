import { groupRoutes } from 'equipped'

import { MembersController } from '@application/controllers/organizations/members'
import { isAuthenticated } from '@application/middlewares'

export const membersRoutes = groupRoutes({ path: '/members', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: MembersController.get,
	},
	{
		path: '/',
		method: 'post',
		handler: MembersController.add,
	},
	{
		path: '/request',
		method: 'post',
		handler: MembersController.request,
	},
	{
		path: '/accept',
		method: 'post',
		handler: MembersController.accept,
	},
	{
		path: '/leave',
		method: 'post',
		handler: MembersController.leave,
	},
	{
		path: '/remove',
		method: 'post',
		handler: MembersController.remove,
	},
])
