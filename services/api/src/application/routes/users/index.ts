import { Router } from 'equipped'
import { connectsRoutes } from './connects'
import { tutorRequestsRoutes } from './tutorRequests'
import { usersRoutes } from './users'
import { verificationsRoutes } from './verifications'

const router = new Router({ path: '/users', groups: ['Users'] })
router.nest()
router.add(...connectsRoutes, ...usersRoutes, ...tutorRequestsRoutes, ...verificationsRoutes)

export default router
