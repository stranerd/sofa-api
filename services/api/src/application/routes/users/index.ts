import { Router } from 'equipped'
import connects from './connects'
import tutorRequests from './tutorRequests'
import users from './users'
import verifications from './verifications'

const router = new Router({ path: '/users', groups: ['Users'] })
router.nest(connects, tutorRequests, users, verifications)

export default router
