import { FacultyController } from '@application/controllers/school/faculties'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/faculties', groups: ['Faculties'] })

router.get({ path: '/', key: 'school-faculties-get' })(FacultyController.get)
router.get({ path: '/:id', key: 'school-faculties-find' })(FacultyController.find)
router.post({ path: '/', key: 'school-faculties-create', middlewares: [isAuthenticated, isAdmin] })(FacultyController.create)
router.put({ path: '/:id', key: 'school-faculties-update', middlewares: [isAuthenticated, isAdmin] })(FacultyController.update)
router.delete({ path: '/:id', key: 'school-faculties-delete', middlewares: [isAuthenticated, isAdmin] })(FacultyController.delete)

export default router
