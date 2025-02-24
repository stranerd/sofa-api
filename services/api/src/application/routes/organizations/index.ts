import { ClassesController } from '@application/controllers/organizations/classes'
import { groupRoutes, Router } from 'equipped'
import { announcementsRoutes } from './announcements'
import { classesRoutes } from './classes'
import { lessonsRoutes } from './lessons'
import { membersRoutes } from './members'
import { schedulesRoutes } from './schedules'

const router = new Router({ path: '/organizations', groups: ['Organizations'] })
router.nest()
router.add(
	...groupRoutes({ path: '/:organizationId' }, [
		...membersRoutes,
		...classesRoutes,
		...groupRoutes({ path: '/classes/:classId' }, [...announcementsRoutes, ...lessonsRoutes, ...schedulesRoutes]),
	]),
	{
		path: '/classes/explore',
		method: 'get',
		handler: async (req) => ClassesController.get(req, true),
	},
)

export default router
