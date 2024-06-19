import { FolderController } from '@application/controllers/study/folders'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const foldersRoutes = groupRoutes({ path: '/folders', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: FolderController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: FolderController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: FolderController.create,
	},
	{
		path: '/:id',
		method: 'put',
		handler: FolderController.update,
	},
	{
		path: '/:id/save',
		method: 'put',
		handler: FolderController.saveProp,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: FolderController.delete,
	},
])
