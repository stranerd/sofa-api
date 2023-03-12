import { groupRoutes } from 'equipped'
import { conversationsRoutes } from './conversations'
import { messagesRoutes } from './messages'

export const conversationRoutes = groupRoutes('/conversations', [
	...conversationsRoutes,
	...messagesRoutes
])