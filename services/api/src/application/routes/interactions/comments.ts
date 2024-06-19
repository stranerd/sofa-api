import { CommentsController } from '@application/controllers/interactions/comments'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const commentsRoutes = groupRoutes({ path: '/comments' }, [
	{
		path: '/',
		method: 'get',
		handler: CommentsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: CommentsController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: CommentsController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: CommentsController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: CommentsController.delete,
	},
])
