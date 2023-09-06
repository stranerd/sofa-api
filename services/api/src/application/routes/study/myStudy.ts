import { MyStudyController } from '@application/controllers/study/myStudy'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const myStudyRoutes = groupRoutes('/my', [
	{
		path: '/recent',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.recent(req)
				}
			})
		]
	}, {
		path: '/byMyOrgs',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.byMyOrgs(req)
				}
			})
		]
	}, {
		path: '/suggested',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.suggested(req)
				}
			})
		]
	}, {
		path: '/latest',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.latest(req)
				}
			})
		]
	}, {
		path: '/rated',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.rated(req)
				}
			})
		]
	}, {
		path: '/popular',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyStudyController.popular(req)
				}
			})
		]
	},
])