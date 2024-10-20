import { QuizController } from '@application/controllers/study/quizzes'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const quizzesRoutes = groupRoutes({ path: '/quizzes' }, [
	{
		path: '/',
		method: 'get',
		handler: QuizController.get,
	},
	{
		path: '/tutors',
		method: 'get',
		middlewares: [isAuthenticated, isAdmin],
		handler: QuizController.getForTutors,
	},
	{
		path: '/:id',
		method: 'get',
		handler: QuizController.find,
	},
	{
		path: '/:id/similar',
		method: 'get',
		handler: QuizController.similar,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: QuizController.update,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.create,
	},
	{
		path: '/ai',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.aiGen,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: QuizController.delete,
	},
	{
		path: '/:id/publish',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.publish,
	},
	{
		path: '/:id/reorder',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.reorder,
	},
	{
		path: '/:id/access/request',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.requestAccess,
	},
	{
		path: '/:id/access/grant',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.grantAccess,
	},
	{
		path: '/:id/access/members/manage',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: QuizController.addMembers,
	},
])
