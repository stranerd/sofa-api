import axios from 'axios'
import { BadRequestError, groupRoutes } from 'equipped'

import { FileController } from '@application/controllers/study/files'
import { isAuthenticated } from '@application/middlewares'

export const filesRoutes = groupRoutes({ path: '/files' }, [
	{
		path: '/',
		method: 'get',
		handler: FileController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: FileController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: FileController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated],
		handler: FileController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated],
		handler: FileController.delete,
	},
	{
		path: '/:id/publish',
		method: 'post',
		middlewares: [isAuthenticated],
		handler: FileController.publish,
	},
	{
		path: '/:id/media',
		method: 'get',
		handler: async (req) => {
			const media = await FileController.media(req)
			const response = await axios.get(media.link, { baseURL: '', responseType: 'stream' }).catch(() => {
				throw new BadRequestError('failed to fetch file')
			})
			return req.pipe(response.data, { headers: response.headers as any })
		},
	},
])
