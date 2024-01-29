import { groupRoutes } from 'equipped'
import { connectsRoutes } from './connects'
import { usersRoutes } from './users'
import { tutorRequestsRoutes } from './tutorRequests'
import { verificationsRoutes } from './verifications'

export const userRoutes = groupRoutes('/users', [...connectsRoutes, ...usersRoutes, ...tutorRequestsRoutes, ...verificationsRoutes])
