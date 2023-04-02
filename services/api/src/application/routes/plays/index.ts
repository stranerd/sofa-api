import { groupRoutes } from 'equipped'
import { gamesRoutes } from './games'

export const playRoutes = groupRoutes('/plays', [
	...gamesRoutes,
])