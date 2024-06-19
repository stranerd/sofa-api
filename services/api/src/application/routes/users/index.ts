import { groupRoutes } from 'equipped'
import { connectsRoutes } from './connects'
import { tutorRequestsRoutes } from './tutorRequests'
import { usersRoutes } from './users'
import { verificationsRoutes } from './verifications'

export const userRoutes = groupRoutes({ path: '/users' }, [
	...connectsRoutes,
	...usersRoutes,
	...tutorRequestsRoutes,
	...verificationsRoutes,
])
