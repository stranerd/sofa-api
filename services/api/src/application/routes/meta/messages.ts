import { MessageController } from '@application/controllers/meta/messages'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const messagesRoutes = groupRoutes('/messages', [
	{
		path: '/',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MessageController.createMessage(req)
				}
			})
		]
	}
])