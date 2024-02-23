import { MessageController } from '@application/controllers/meta/messages'
import { groupRoutes, makeController } from 'equipped'

export const messagesRoutes = groupRoutes('/messages', [
	{
		path: '/',
		method: 'post',
		controllers: [makeController(async (req) => MessageController.createMessage(req))],
	},
])
