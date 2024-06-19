import { groupRoutes } from 'equipped'
import { notificationsRoutes } from './notifications'
import { tokenRoutes } from './tokens'

export const notificationRoutes = groupRoutes({ path: '/notifications' }, [...notificationsRoutes, ...tokenRoutes])
