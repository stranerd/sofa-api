import { MembersController } from '@application/controllers/organizations/members'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const membersRoutes = groupRoutes('/members', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.get(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.add(req))],
	},
	{
		path: '/request',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.request(req))],
	},
	{
		path: '/accept',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.accept(req))],
	},
	{
		path: '/leave',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.leave(req))],
	},
	{
		path: '/remove',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MembersController.remove(req))],
	},
])
