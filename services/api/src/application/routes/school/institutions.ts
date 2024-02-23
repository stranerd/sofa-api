import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { InstitutionController } from '../../controllers/school/institutions'

export const institutionsRoutes = groupRoutes('/institutions', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => InstitutionController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => InstitutionController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => InstitutionController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => InstitutionController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => InstitutionController.delete(req))],
	},
])
