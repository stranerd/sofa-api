import { authRoutes } from './auth'
import { interactionRoutes } from './interactions'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { schoolRoutes } from './school'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...interactionRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...schoolRoutes,
	...userRoutes
]