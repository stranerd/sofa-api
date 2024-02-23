import { QuestionController } from '@application/controllers/study/questions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const questionsRoutes = groupRoutes('/quizzes/:quizId/questions', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => QuestionController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => QuestionController.find(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => QuestionController.update(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuestionController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => QuestionController.delete(req))],
	},
])
