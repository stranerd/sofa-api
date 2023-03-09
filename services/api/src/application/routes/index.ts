import { authRoutes } from './auth'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { schoolRoutes } from './school'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...schoolRoutes,
	...userRoutes
]