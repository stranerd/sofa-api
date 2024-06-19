import { MyStudyController } from '@application/controllers/study/myStudy'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const myStudyRoutes = groupRoutes({ path: '/my', middlewares: [isAuthenticated] }, [
	{
		path: '/recent',
		method: 'get',
		handler: MyStudyController.recent,
	},
	{
		path: '/byMyOrgs',
		method: 'get',
		handler: MyStudyController.byMyOrgs,
	},
	{
		path: '/suggested',
		method: 'get',
		handler: MyStudyController.suggested,
	},
	{
		path: '/latest',
		method: 'get',
		handler: MyStudyController.latest,
	},
	{
		path: '/rated',
		method: 'get',
		handler: MyStudyController.rated,
	},
	{
		path: '/popular',
		method: 'get',
		handler: MyStudyController.popular,
	},
])
