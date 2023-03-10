import { authRoutes } from './auth'
import { interactionRoutes } from './interactions'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { schoolRoutes } from './school'
import { studyRoutes } from './study'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...interactionRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...schoolRoutes,
	...studyRoutes,
	...userRoutes
]