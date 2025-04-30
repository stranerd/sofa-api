import { groupRoutes } from 'equipped'

import { PlayController } from '@application/controllers/plays/plays'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { UsersUseCases } from '@modules/users'

export const playsRoutes = groupRoutes({ path: '/plays', middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: PlayController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: PlayController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: PlayController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: PlayController.delete,
	},
	{
		path: '/:id/start',
		method: 'post',
		handler: PlayController.start,
	},
	{
		path: '/:id/join',
		method: 'post',
		handler: PlayController.join,
	},
	{
		path: '/:id/end',
		method: 'post',
		handler: PlayController.end,
	},
	{
		path: '/:id/export',
		method: 'post',
		handler: PlayController.export,
	},
	{
		path: '/export/admin',
		method: 'post',
		middlewares: [isAdmin],
		handler: PlayController.adminExport,
	},
	{
		path: '/:id/questions',
		method: 'get',
		handler: PlayController.getQuestions,
	},
	{
		path: '/:id/corrections',
		method: 'get',
		handler: PlayController.getCorrections,
	},
	{
		path: '/export/users',
		method: 'get',
		middlewares: [isAdmin],
		handler: async (req) => {
			const { results: users } = await UsersUseCases.get(req.query ?? {})

			const columns = ['Name', 'Email', 'Phone', 'User Type']

			const rows = users.map((user) => {
				if (user.type?.type !== 'student') return undefined!
				return [user.bio.name.full, user.bio.email, user.bio.phone ? `${user.bio.phone.code}-${user.bio.phone.number}` : '', user.type?.type ?? '']
			}).filter(Boolean)

			const csv = [columns, ...rows].map((row) => row.join(',')).join('\n')

			return req.res({ body: csv, headers: { 'Content-Type': 'text/csv' } })
		}
	}
])
