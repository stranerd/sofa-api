import { AnswerController } from '@application/controllers/plays/answers'
import { isAuthenticated } from '@application/middlewares'
import { PlayTypes } from '@modules/plays'
import { groupRoutes, makeController } from 'equipped'

const types = Object.values(PlayTypes).join('|')
export const answersRoutes = groupRoutes(`/:type(${types})/:typeId/answers`, [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => AnswerController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => AnswerController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => AnswerController.answer(req))],
	},
	{
		path: '/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => AnswerController.end(req))],
	},
	{
		path: '/reset',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => AnswerController.reset(req))],
	},
])
