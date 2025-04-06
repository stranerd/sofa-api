import { groupRoutes } from 'equipped'

import { ConversationController } from '@application/controllers/conversations/conversations'
import { isAuthenticated } from '@application/middlewares'

export const conversationsRoutes = groupRoutes({ path: '/conversations', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: async (req) => ConversationController.get(req),
	},
	{
		path: '/:id',
		method: 'get',
		handler: async (req) => ConversationController.find(req),
	},
	{
		path: '/',
		method: 'post',
		handler: async (req) => ConversationController.create(req),
	},
	{
		path: '/:id',
		method: 'put',
		handler: async (req) => ConversationController.update(req),
	},
	{
		path: '/:id',
		method: 'delete',
		handler: async (req) => ConversationController.delete(req),
	},
	{
		path: '/:id/accept',
		method: 'post',
		handler: async (req) => ConversationController.accept(req),
	},
	{
		path: '/:id/end',
		method: 'post',
		handler: async (req) => ConversationController.end(req),
	},
])
