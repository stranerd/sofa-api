import { UsersController } from '@application/controllers/users/users'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/users', groups: ['Users'] })

router.post({ path: '/type', key: 'users-type-update', middlewares: [isAuthenticated] })(UsersController.updateType)
router.post({ path: '/organization/code', key: 'users-organization-code-update', middlewares: [isAuthenticated] })(
	UsersController.updateOrgCode,
)
router.post({ path: '/ai', key: 'users-ai-update', middlewares: [isAuthenticated] })(UsersController.updateAi)
router.get({ path: '/', key: 'users-get' })(UsersController.get)
router.get({ path: '/:id', key: 'users-find' })(UsersController.find)
router.post({ path: '/socials', key: 'users-socials-update', middlewares: [isAuthenticated] })(UsersController.updateSocials)
router.post({ path: '/location', key: 'users-location-update', middlewares: [isAuthenticated] })(UsersController.updateLocation)
router.post({ path: '/editing/quizzes', key: 'users-editing-quizzes-update', middlewares: [isAuthenticated] })(
	UsersController.updateEditingQuizzes,
)
router.post({ path: '/saved/classes', key: 'users-saved-classes-update', middlewares: [isAuthenticated] })(
	UsersController.updateSavedClasses,
)

export default router
