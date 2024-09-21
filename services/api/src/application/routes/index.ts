import { Router } from 'equipped'
import auth from './auth'
import { conversationRoutes } from './conversations'
import { interactionRoutes } from './interactions'
import { metaRoutes } from './meta'
import { notificationRoutes } from './notifications'
import { organizationsRoutes } from './organizations'
import { paymentRoutes } from './payment'
import { playRoutes } from './plays'
import { schoolRoutes } from './school'
import { studyRoutes } from './study'
import { userRoutes } from './users'

export const router = new Router()
router.nest(auth)
router.add(
	...conversationRoutes,
	...interactionRoutes,
	...metaRoutes,
	...notificationRoutes,
	...organizationsRoutes,
	...paymentRoutes,
	...playRoutes,
	...schoolRoutes,
	...studyRoutes,
	...userRoutes,
)
