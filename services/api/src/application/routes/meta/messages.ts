import { groupRoutes } from 'equipped'

import { MessageController } from '@application/controllers/meta/messages'

export const messagesRoutes = groupRoutes({ path: '/messages' }, [
	{
		path: '/',
		method: 'post',
		handler: MessageController.createMessage,
	},
])
