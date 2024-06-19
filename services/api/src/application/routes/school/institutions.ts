import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { InstitutionController } from '../../controllers/school/institutions'

export const institutionsRoutes = groupRoutes({ path: '/institutions' }, [
	{
		path: '/',
		method: 'get',
		handler: InstitutionController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: InstitutionController.find,
	},
	{
		path: '/',
		method: 'post',
		middlewares: [isAuthenticated, isAdmin],
		handler: InstitutionController.create,
	},
	{
		path: '/:id',
		method: 'put',
		middlewares: [isAuthenticated, isAdmin],
		handler: InstitutionController.update,
	},
	{
		path: '/:id',
		method: 'delete',
		middlewares: [isAuthenticated, isAdmin],
		handler: InstitutionController.delete,
	},
])
