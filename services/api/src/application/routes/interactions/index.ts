import { groupRoutes } from 'equipped'
import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { reviewsRoutes } from './reviews'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

export const interactionRoutes = groupRoutes('/interactions', [
	...commentsRoutes,
	...likesRoutes,
	...reviewsRoutes,
	...tagsRoutes,
	...viewsRoutes
])