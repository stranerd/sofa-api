import { groupRoutes } from 'equipped'
import { membersRoutes } from './members'

export const organizationsRoutes = groupRoutes('/organizations/:organizationId', [
	...membersRoutes,
])