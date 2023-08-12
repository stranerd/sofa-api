import { TestController } from '@application/controllers/plays/tests'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const testsRoutes = groupRoutes('/tests', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TestController.get(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TestController.find(req)
				}
			})
		]
	}, {
		path: '/:id/questions',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TestController.getQuestions(req)
				}
			})
		]
	}
])