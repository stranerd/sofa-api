import { PlayController } from '@application/controllers/plays/plays'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const playsRoutes = groupRoutes({ path: '/plays', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: PlayController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: PlayController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: PlayController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: PlayController.delete,
	},
	{
		path: '/:id/start',
		method: 'post',
		handler: PlayController.start,
	},
	{
		path: '/:id/join',
		method: 'post',
		handler: PlayController.join,
	},
	{
		path: '/:id/end',
		method: 'post',
		handler: PlayController.end,
	},
	{
		path: '/:id/export',
		method: 'post',
		handler: PlayController.export,
	},
	{
		path: '/:id/questions',
		method: 'get',
		handler: PlayController.getQuestions,
	},
	{
		path: '/:id/corrections',
		method: 'get',
		handler: PlayController.getCorrections,
	},
])
