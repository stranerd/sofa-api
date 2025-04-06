import { groupRoutes } from 'equipped'

import { messagesRoutes } from './messages'

export const metaRoutes = groupRoutes({ path: '/meta' }, [...messagesRoutes])
