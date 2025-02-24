import { Router } from 'equipped'
import { coursesRoutes } from './courses'
import { filesRoutes } from './files'
import { foldersRoutes } from './folders'
import { myStudyRoutes } from './myStudy'
import { questionsRoutes } from './questions'
import { quizzesRoutes } from './quizzes'

const router = new Router({ path: '/study', groups: ['Study'] })
router.nest()
router.add(...quizzesRoutes, ...questionsRoutes, ...foldersRoutes, ...coursesRoutes, ...filesRoutes, ...myStudyRoutes)

export default router
