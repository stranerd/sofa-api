import { groupRoutes } from 'equipped'
import { answersRoutes } from './answers'
import { gamesRoutes } from './games'
import { testsRoutes } from './tests'

export const playRoutes = groupRoutes('/plays', [
	...gamesRoutes,
	...testsRoutes,
	...answersRoutes
])