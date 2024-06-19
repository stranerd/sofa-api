import { groupRoutes } from 'equipped'
import { conversationsRoutes } from './conversations'
import { messagesRoutes } from './messages'

export const conversationRoutes = groupRoutes({ path: '/conversations' }, [...conversationsRoutes, ...messagesRoutes])
