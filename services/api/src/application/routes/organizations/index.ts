import { ClassesController } from '@application/controllers/organizations/classes'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { announcementsRoutes } from './announcements'
import { classesRoutes } from './classes'
import { lessonsRoutes } from './lessons'
import { membersRoutes } from './members'
import { schedulesRoutes } from './schedules'

export const organizationsRoutes = groupRoutes('/organizations/:organizationId', [
	...membersRoutes,
	...classesRoutes,
	...groupRoutes('/classes/:classId', [...announcementsRoutes, ...lessonsRoutes, ...schedulesRoutes]),
]).concat([
	{
		path: '/organizations/classes/explore',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ClassesController.get(req, true),
			})),
		],
	},
])
