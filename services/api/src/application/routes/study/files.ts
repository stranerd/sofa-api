import { FileController } from '@application/controllers/study/files'
import { isAuthenticated } from '@application/middlewares'
import axios from 'axios'
import { BadRequestError, groupRoutes, makeController } from 'equipped'

export const filesRoutes = groupRoutes('/files', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => FileController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => FileController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => FileController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => FileController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => FileController.delete(req))],
	},
	{
		path: '/:id/publish',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => FileController.publish(req))],
	},
	{
		path: '/:id/media',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				const media = await FileController.media(req)
				const response = await axios.get(media.link, { baseURL: '', responseType: 'stream' }).catch(() => {
					throw new BadRequestError('failed to fetch file')
				})
				return req.pipe((stream) => response.data.pipe(stream))
			}),
		],
	},
])
