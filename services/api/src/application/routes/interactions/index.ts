import { groupRoutes } from 'equipped'
import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

export const interactionRoutes = groupRoutes('/interactions', [
	...commentsRoutes,
	...likesRoutes,
	...tagsRoutes,
	...viewsRoutes
])