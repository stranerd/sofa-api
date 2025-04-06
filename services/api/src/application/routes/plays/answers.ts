import { groupRoutes } from 'equipped'

import { AnswerController } from '@application/controllers/plays/answers'
import { isAuthenticated } from '@application/middlewares'
import { PlayTypes } from '@modules/plays'

const types = Object.values(PlayTypes).join('|')
export const answersRoutes = groupRoutes({ path: `/:type(${types})/:typeId/answers`, middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: AnswerController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: AnswerController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: AnswerController.answer,
	},
	{
		path: '/end',
		method: 'post',
		handler: AnswerController.end,
	},
	{
		path: '/reset',
		method: 'post',
		handler: AnswerController.reset,
	},
])
