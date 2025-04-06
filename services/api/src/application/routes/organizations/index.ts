import { groupRoutes } from 'equipped'

import { ClassesController } from '@application/controllers/organizations/classes'

import { announcementsRoutes } from './announcements'
import { classesRoutes } from './classes'
import { lessonsRoutes } from './lessons'
import { membersRoutes } from './members'
import { schedulesRoutes } from './schedules'

export const organizationsRoutes = groupRoutes({ path: '/organizations/:organizationId' }, [
	...membersRoutes,
	...classesRoutes,
	...groupRoutes({ path: '/classes/:classId' }, [...announcementsRoutes, ...lessonsRoutes, ...schedulesRoutes]),
]).concat([
	{
		path: '/organizations/classes/explore',
		method: 'get',
		handler: async (req) => ClassesController.get(req, true),
	},
])
