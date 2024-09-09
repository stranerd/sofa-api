import { QuestionController } from '@application/controllers/study/questions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const questionsRoutes = groupRoutes({ path: '/quizzes/:quizId/questions', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: QuestionController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: QuestionController.find,
	},
	{
		path: '/:id',
		method: 'put',
		handler: QuestionController.update,
	},
	{
		path: '/',
		method: 'post',
		handler: QuestionController.create,
	},
	{
		path: '/ai',
		method: 'post',
		handler: QuestionController.aiGen,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: QuestionController.delete,
	},
])
