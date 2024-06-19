import { MessageController } from '@application/controllers/meta/messages'
import { groupRoutes } from 'equipped'

export const messagesRoutes = groupRoutes({ path: '/messages' }, [
	{
		path: '/',
		method: 'post',
		handler: MessageController.createMessage,
	},
])
