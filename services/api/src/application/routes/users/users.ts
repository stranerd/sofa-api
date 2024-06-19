import { UsersController } from '@application/controllers/users/users'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const usersRoutes = groupRoutes({ path: '/users' }, [
	{
		path: '/type',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateType,
	},
	{
		path: '/organization/code',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateOrgCode,
	},
	{
		path: '/ai',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateAi,
	},
	{
		path: '/',
		method: 'get',
		handler: UsersController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: UsersController.find,
	},
	{
		path: '/socials',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateSocials,
	},
	{
		path: '/location',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateLocation,
	},
	{
		path: '/editing/quizzes',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateEditingQuizzes,
	},
	{
		path: '/saved/classes',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: UsersController.updateSavedClasses,
	},
])
