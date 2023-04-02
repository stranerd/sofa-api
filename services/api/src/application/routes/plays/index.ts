import { groupRoutes } from 'equipped'
import { gamesRoutes } from './games'

export const studyRoutes = groupRoutes('/plays', [
	...gamesRoutes,
])