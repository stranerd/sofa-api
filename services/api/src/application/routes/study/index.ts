import { groupRoutes } from 'equipped'
import { coursesRoutes } from './courses'
import { foldersRoutes } from './folders'
import { gamesRoutes } from './games'
import { questionsRoutes } from './questions'
import { quizzesRoutes } from './quizzes'

export const studyRoutes = groupRoutes('/study', [
	...quizzesRoutes,
	...questionsRoutes,
	...gamesRoutes,
	...foldersRoutes,
	...coursesRoutes
])