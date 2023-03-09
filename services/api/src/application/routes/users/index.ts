import { groupRoutes } from 'equipped'
import { connectsRoutes } from './connects'
import { usersRoutes } from './users'

export const userRoutes = groupRoutes('/users', [
	...connectsRoutes,
	...usersRoutes
])