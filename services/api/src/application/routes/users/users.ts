import { UsersController } from '@application/controllers/users/users'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const usersRoutes = groupRoutes('/users', [
	{
		path: '/type',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateType(req))],
	},
	{
		path: '/organization/code',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateOrgCode(req))],
	},
	{
		path: '/ai',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateAi(req))],
	},
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => UsersController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => UsersController.find(req))],
	},
	{
		path: '/socials',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateSocials(req))],
	},
	{
		path: '/location',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateLocation(req))],
	},
	{
		path: '/editing/quizzes',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateEditingQuizzes(req))],
	},
	{
		path: '/saved/classes',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateSavedClasses(req))],
	},
])
