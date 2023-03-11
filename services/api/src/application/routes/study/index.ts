import { groupRoutes } from 'equipped'
import { foldersRoutes } from './folders'
import { quizzesRoutes } from './quizzes'

export const studyRoutes = groupRoutes('/study', [
	...quizzesRoutes,
	...foldersRoutes
])