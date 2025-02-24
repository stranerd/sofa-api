import { Router } from 'equipped'
import courses from './courses'
import files from './files'
import folders from './folders'
import myStudy from './myStudy'
import questions from './questions'
import quizzes from './quizzes'

const router = new Router({ path: '/study', groups: ['Study'] })
router.nest(courses, files, folders, myStudy, questions, quizzes)

export default router
