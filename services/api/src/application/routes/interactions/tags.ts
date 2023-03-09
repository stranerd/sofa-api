import { TagController } from '@application/controllers/interactions/tags'
import { isAdmin } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const tagsRoutes = groupRoutes('/tags', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.GetTags(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.FindTag(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'put',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.UpdateTag(req)
				}
			})
		]
	}, {
		path: '/',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.CreateTag(req)
				}
			})
		]
	}, {
		path: '/:id',
		method: 'delete',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.DeleteTag(req)
				}
			})
		]
	}
])