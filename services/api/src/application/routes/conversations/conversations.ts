import { ConversationController } from '@application/controllers/conversations/conversations'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const conversationsRoutes = groupRoutes('/conversations', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.delete(req))],
	},
	{
		path: '/:id/accept',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.accept(req))],
	},
	{
		path: '/:id/end',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ConversationController.end(req))],
	},
])
