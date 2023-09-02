import { groupRoutes } from 'equipped'
import { conversationsRoutes } from './conversations'
import { messagesRoutes } from './messages'
import { tutorRequestRoutes } from './tutorRequests'

export const conversationRoutes = groupRoutes('/conversations', [
	...conversationsRoutes,
	...messagesRoutes,
	...tutorRequestRoutes
])