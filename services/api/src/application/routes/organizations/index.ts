import { groupRoutes } from 'equipped'
import { announcementsRoutes } from './announcements'
import { classesRoutes } from './classes'
import { membersRoutes } from './members'

export const organizationsRoutes = groupRoutes('/organizations/:organizationId', [
	...membersRoutes,
	...classesRoutes,
	...groupRoutes('/classes/:classId', announcementsRoutes),
])