import { MessageController } from '@application/controllers/conversations/messages'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const messagesRoutes = groupRoutes('/conversations/:conversationId/messages', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MessageController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MessageController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MessageController.create(req))],
	},
	{
		path: '/:id/star',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MessageController.star(req))],
	},
	{
		path: '/read',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => MessageController.markRead(req))],
	},
])
