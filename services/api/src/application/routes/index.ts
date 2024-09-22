import { Router } from 'equipped'
import auth from './auth'
import conversations from './conversations'
import interactions from './interactions'
import meta from './meta'
import notifications from './notifications'
import { organizationsRoutes } from './organizations'
import payment from './payment'
import { playRoutes } from './plays'
import { schoolRoutes } from './school'
import { studyRoutes } from './study'
import { userRoutes } from './users'

export const router = new Router()
router.nest(auth, conversations, interactions, meta, notifications, payment)
router.add(...organizationsRoutes, ...playRoutes, ...schoolRoutes, ...studyRoutes, ...userRoutes)
