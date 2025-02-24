import { QuestionController } from '@application/controllers/study/questions'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/quizzes/:quizId/questions', groups: ['Questions'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'study-questions-get' })(QuestionController.get)
router.get({ path: '/:id', key: 'study-questions-find' })(QuestionController.find)
router.put({ path: '/:id', key: 'study-questions-update' })(QuestionController.update)
router.post({ path: '/', key: 'study-questions-create' })(QuestionController.create)
router.post({ path: '/ai', key: 'study-questions-aiGen' })(QuestionController.aiGen)
router.delete({ path: '/:id', key: 'study-questions-delete' })(QuestionController.delete)

export default router
