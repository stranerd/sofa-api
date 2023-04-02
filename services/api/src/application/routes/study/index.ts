import { groupRoutes } from 'equipped'
import { coursesRoutes } from './courses'
import { foldersRoutes } from './folders'
import { questionsRoutes } from './questions'
import { quizzesRoutes } from './quizzes'

export const studyRoutes = groupRoutes('/study', [
	...quizzesRoutes,
	...questionsRoutes,
	...foldersRoutes,
	...coursesRoutes
])