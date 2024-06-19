import { groupRoutes } from 'equipped'
import { coursesRoutes } from './courses'
import { filesRoutes } from './files'
import { foldersRoutes } from './folders'
import { myStudyRoutes } from './myStudy'
import { questionsRoutes } from './questions'
import { quizzesRoutes } from './quizzes'

export const studyRoutes = groupRoutes({ path: '/study' }, [
	...quizzesRoutes,
	...questionsRoutes,
	...foldersRoutes,
	...coursesRoutes,
	...filesRoutes,
	...myStudyRoutes,
])
