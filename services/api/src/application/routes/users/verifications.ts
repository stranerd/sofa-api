import { VerificationsController } from '@application/controllers/users/verifications'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/verifications', groups: ['Verifications'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'users-verifications-get' })(VerificationsController.get)
router.get({ path: '/:id', key: 'users-verifications-find' })(VerificationsController.find)
router.post({ path: '/', key: 'users-verifications-create' })(VerificationsController.create)
router.put({ path: '/:id/accept', key: 'users-verifications-accept', middlewares: [isAdmin] })(VerificationsController.accept)

export default router
