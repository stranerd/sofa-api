import { AnswerController } from '@application/controllers/plays/answers'
import { isAuthenticated } from '@application/middlewares'
import { PlayTypes } from '@modules/plays'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

const types = Object.values(PlayTypes).join('|')
export const answersRoutes = groupRoutes(`/:type(${types})/:typeId/answers`, [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.get(req)
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
					result: await AnswerController.find(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AnswerController.answer(req)
				}
			})
		]
	}
])