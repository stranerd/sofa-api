import { groupRoutes } from 'equipped'
import { conversationsRoutes } from './conversations'
import { messagesRoutes } from './messages'
import { reviewsRoutes } from './reviews'

export const conversationRoutes = groupRoutes('/conversations', [
	...conversationsRoutes,
	...messagesRoutes,
	...reviewsRoutes
])