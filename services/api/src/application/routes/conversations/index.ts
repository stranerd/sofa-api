import { groupRoutes } from 'equipped'
import { conversationsRoutes } from './conversations'

export const conversationRoutes = groupRoutes('/conversations', [
	...conversationsRoutes
])