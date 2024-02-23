import { QuizController } from '@application/controllers/study/quizzes'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const quizzesRoutes = groupRoutes('/quizzes', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => QuizController.get(req))],
	},
	{
		path: '/tutors',
		method: 'get',
		controllers: [isAdmin, makeController(async (req) => QuizController.getForTutors(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => QuizController.find(req))],
	},
	{
		path: '/:id/similar',
		method: 'get',
		controllers: [makeController(async (req) => QuizController.similar(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.update(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.delete(req))],
	},
	{
		path: '/:id/publish',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.publish(req))],
	},
	{
		path: '/:id/reorder',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.reorder(req))],
	},
	{
		path: '/:id/access/request',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.requestAccess(req))],
	},
	{
		path: '/:id/access/grant',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.grantAccess(req))],
	},
	{
		path: '/:id/access/members/manage',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => QuizController.addMembers(req))],
	},
])
