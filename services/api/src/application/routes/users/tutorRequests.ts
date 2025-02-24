import { TutorRequestsController } from '@application/controllers/users/tutorRequests'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/tutorRequests', groups: ['Tutor Requests'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'users-tutorRequests-get' })(TutorRequestsController.get)
router.get({ path: '/:id', key: 'users-tutorRequests-find' })(TutorRequestsController.find)
router.post({ path: '/', key: 'users-tutorRequests-create' })(TutorRequestsController.create)
router.put({ path: '/:id/accept', key: 'users-tutorRequests-accept', middlewares: [isAdmin] })(TutorRequestsController.accept)

export default router
