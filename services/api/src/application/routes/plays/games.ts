import { GameController } from '@application/controllers/plays/games'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const gamesRoutes = groupRoutes('/games', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.find(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.create(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.delete(req),
			})),
		],
	},
	{
		path: '/:id/start',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.start(req),
			})),
		],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.end(req),
			})),
		],
	},
	{
		path: '/:id/join',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.join(req),
			})),
		],
	},
	{
		path: '/:id/questions',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await GameController.getQuestions(req),
			})),
		],
	},
])
