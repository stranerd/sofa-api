import { LessonsController } from '@application/controllers/organizations/lessons'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const lessonsRoutes = groupRoutes('/lessons', [
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.delete(req))],
	},
	{
		path: '/:id/members/join',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.join(req))],
	},
	{
		path: '/:id/members/teachers',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.manageTeachers(req))],
	},
	{
		path: '/:id/curriculum',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => LessonsController.updateCurriculum(req))],
	},
])
