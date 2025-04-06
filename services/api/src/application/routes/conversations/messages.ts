import { groupRoutes } from 'equipped'

import { MessageController } from '@application/controllers/conversations/messages'
import { isAuthenticated } from '@application/middlewares'

export const messagesRoutes = groupRoutes({ path: '/conversations/:conversationId/messages', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: async (req) => MessageController.get(req),
	},
	{
		path: '/:id',
		method: 'get',
		handler: async (req) => MessageController.find(req),
	},
	{
		path: '/',
		method: 'post',
		handler: async (req) => MessageController.create(req),
	},
	{
		path: '/:id/star',
		method: 'post',
		handler: async (req) => MessageController.star(req),
	},
	{
		path: '/read',
		method: 'put',
		handler: async (req) => MessageController.markRead(req),
	},
])
