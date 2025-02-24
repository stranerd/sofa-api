import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'
import { InstitutionController } from '../../controllers/school/institutions'

const router = new Router({ path: '/institutions', groups: ['Institutions'] })

router.get({ path: '/', key: 'school-institutions-get' })(InstitutionController.get)
router.get({ path: '/:id', key: 'school-institutions-find' })(InstitutionController.find)
router.post({ path: '/', key: 'school-institutions-create', middlewares: [isAuthenticated, isAdmin] })(InstitutionController.create)
router.put({ path: '/:id', key: 'school-institutions-update', middlewares: [isAuthenticated, isAdmin] })(InstitutionController.update)
router.delete({ path: '/:id', key: 'school-institutions-delete', middlewares: [isAuthenticated, isAdmin] })(InstitutionController.delete)

export default router
