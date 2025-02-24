import { ConnectsController } from '@application/controllers/users/connects'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/connects', groups: ['Connects'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'users-connects-get' })(ConnectsController.get)
router.get({ path: '/:id', key: 'users-connects-find' })(ConnectsController.find)
router.post({ path: '/', key: 'users-connects-create' })(ConnectsController.create)
router.put({ path: '/:id/accept', key: 'users-connects-accept' })(ConnectsController.accept)
router.delete({ path: '/:id', key: 'users-connects-delete' })(ConnectsController.delete)

export default router
