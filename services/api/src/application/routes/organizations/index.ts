import { groupRoutes } from 'equipped'
import { classesRoutes } from './classes'
import { membersRoutes } from './members'

export const organizationsRoutes = groupRoutes('/organizations/:organizationId', [
	...classesRoutes,
	...membersRoutes,
])