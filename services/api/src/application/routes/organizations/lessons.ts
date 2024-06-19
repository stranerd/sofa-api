import { LessonsController } from '@application/controllers/organizations/lessons'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const lessonsRoutes = groupRoutes({ path: '/lessons', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'post',
		handler: LessonsController.create,
	},
	{
		path: '/:id',
		method: 'put',
		handler: LessonsController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: LessonsController.delete,
	},
	{
		path: '/:id/members/join',
		method: 'post',
		handler: LessonsController.join,
	},
	{
		path: '/:id/members/teachers',
		method: 'post',
		handler: LessonsController.manageTeachers,
	},
	{
		path: '/:id/curriculum',
		method: 'post',
		handler: LessonsController.updateCurriculum,
	},
])
