import { FolderController } from '@application/controllers/study/folders'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const foldersRoutes = groupRoutes('/folders', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.update(req))],
	},
	{
		path: '/:id/save',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.saveProp(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => FolderController.delete(req))],
	},
])
