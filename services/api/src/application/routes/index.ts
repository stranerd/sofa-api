import { authRoutes } from './auth'
import { conversationRoutes } from './conversations'
import { interactionRoutes } from './interactions'
import { metaRoutes } from './meta'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { playRoutes } from './plays'
import { schoolRoutes } from './school'
import { studyRoutes } from './study'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...conversationRoutes,
	...interactionRoutes,
	...metaRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...playRoutes,
	...schoolRoutes,
	...studyRoutes,
	...userRoutes,
]