import { CourseController } from '@application/controllers/school/courses'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/courses', groups: ['Courses'] })

router.get({ path: '/', key: 'school-courses-get' })(CourseController.get)
router.get({ path: '/:id', key: 'school-courses-find' })(CourseController.find)
router.post({ path: '/', key: 'school-courses-create', middlewares: [isAuthenticated, isAdmin] })(CourseController.create)
router.put({ path: '/:id', key: 'school-courses-update', middlewares: [isAuthenticated, isAdmin] })(CourseController.update)
router.delete({ path: '/:id', key: 'school-courses-delete', middlewares: [isAuthenticated, isAdmin] })(CourseController.delete)

export default router
