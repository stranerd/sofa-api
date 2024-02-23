import { MyStudyController } from '@application/controllers/study/myStudy'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const myStudyRoutes = groupRoutes('/my', [
	{
		path: '/recent',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.recent(req))],
	},
	{
		path: '/byMyOrgs',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.byMyOrgs(req))],
	},
	{
		path: '/suggested',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.suggested(req))],
	},
	{
		path: '/latest',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.latest(req))],
	},
	{
		path: '/rated',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.rated(req))],
	},
	{
		path: '/popular',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyStudyController.popular(req))],
	},
])
