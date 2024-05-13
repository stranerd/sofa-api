import { PlayController } from '@application/controllers/plays/plays'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const playsRoutes = groupRoutes('/plays', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.delete(req))],
	},
	{
		path: '/:id/start',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.start(req))],
	},
	{
		path: '/:id/join',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.join(req))],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.end(req))],
	},
	{
		path: '/:id/export',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.export(req))],
	},
	{
		path: '/:id/questions',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => PlayController.getQuestions(req))],
	},
])
