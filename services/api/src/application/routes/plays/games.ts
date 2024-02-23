import { GameController } from '@application/controllers/plays/games'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const gamesRoutes = groupRoutes('/games', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => GameController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => GameController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => GameController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => GameController.delete(req))],
	},
	{
		path: '/:id/start',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => GameController.start(req))],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => GameController.end(req))],
	},
	{
		path: '/:id/join',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => GameController.join(req))],
	},
	{
		path: '/:id/questions',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => GameController.getQuestions(req))],
	},
])
