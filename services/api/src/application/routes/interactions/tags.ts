import { groupRoutes } from 'equipped'

import { TagController } from '@application/controllers/interactions/tags'
import { isAdmin } from '@application/middlewares'

export const tagsRoutes = groupRoutes({ path: '/tags' }, [
	{
		path: '/',
		method: 'get',
		handler: TagController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: TagController.find,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAdmin],
		handler: TagController.update,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAdmin],
		handler: TagController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAdmin],
		handler: TagController.delete,
	},
])
