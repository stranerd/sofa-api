import { groupRoutes } from 'equipped'
import { answersRoutes } from './answers'
import { gamesRoutes } from './games'

export const playRoutes = groupRoutes('/plays', [
	...gamesRoutes,
	...answersRoutes
])