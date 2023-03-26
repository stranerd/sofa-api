import { groupRoutes } from 'equipped'
import { connectsRoutes } from './connects'
import { usersRoutes } from './users'
import { verificationsRoutes } from './verifications'

export const userRoutes = groupRoutes('/users', [
	...connectsRoutes,
	...usersRoutes,
	...verificationsRoutes
])