import { TestController } from '@application/controllers/plays/tests'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const testsRoutes = groupRoutes('/tests', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TestController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TestController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TestController.create(req))],
	},
	{
		path: '/:id/questions',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TestController.getQuestions(req))],
	},
	{
		path: '/:id/start',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TestController.start(req))],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TestController.end(req))],
	},
])
