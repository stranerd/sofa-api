import { groupRoutes } from 'equipped'
import { cardsRoutes } from './cards'
import { foldersRoutes } from './folders'

export const studyRoutes = groupRoutes('/study', [
	...cardsRoutes,
	...foldersRoutes
])