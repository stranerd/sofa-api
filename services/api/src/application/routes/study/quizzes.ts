import { QuizController } from '@application/controllers/study/quizzes'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/quizzes', groups: ['Quizzes'] })

router.get({ path: '/', key: 'study-quizzes-get' })(QuizController.get)
router.get({ path: '/tutors', key: 'study-quizzes-getForTutors', middlewares: [isAuthenticated, isAdmin] })(QuizController.getForTutors)
router.get({ path: '/:id', key: 'study-quizzes-find' })(QuizController.find)
router.get({ path: '/:id/similar', key: 'study-quizzes-similar' })(QuizController.similar)
router.put({ path: '/:id', key: 'study-quizzes-update', middlewares: [isAuthenticated] })(QuizController.update)
router.post({ path: '/', key: 'study-quizzes-create', middlewares: [isAuthenticated] })(QuizController.create)
router.delete({ path: '/:id', key: 'study-quizzes-delete', middlewares: [isAuthenticated] })(QuizController.delete)
router.post({ path: '/:id/publish', key: 'study-quizzes-publish', middlewares: [isAuthenticated] })(QuizController.publish)
router.post({ path: '/:id/reorder', key: 'study-quizzes-reorder', middlewares: [isAuthenticated] })(QuizController.reorder)
router.post({ path: '/:id/access/request', key: 'study-quizzes-requestAccess', middlewares: [isAuthenticated] })(
	QuizController.requestAccess,
)
router.post({ path: '/:id/access/grant', key: 'study-quizzes-grantAccess', middlewares: [isAuthenticated] })(QuizController.grantAccess)
router.post({ path: '/:id/access/members/manage', key: 'study-quizzes-addMembers', middlewares: [isAuthenticated] })(
	QuizController.addMembers,
)

export default router
