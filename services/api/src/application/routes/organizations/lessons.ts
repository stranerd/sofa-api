import { LessonsController } from '@application/controllers/organizations/lessons'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const lessonsRoutes = groupRoutes('/lessons', [
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await LessonsController.create(req)
				}
			})
		]
	},  {
		path: '/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await LessonsController.update(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await LessonsController.delete(req)
				}
			})
		]
	},  {
		path: '/:id/members/join',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await LessonsController.join(req)
				}
			})
		]
	},  {
		path: '/:id/members/teachers',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await LessonsController.manageTeachers(req)
				}
			})
		]
	},
])