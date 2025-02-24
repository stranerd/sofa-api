import { CourseController } from '@application/controllers/study/courses'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/courses', groups: ['Courses'] })

router.get({ path: '/', key: 'study-courses-get' })(CourseController.get)
router.get({ path: '/:id', key: 'study-courses-find' })(CourseController.find)
router.get({ path: '/:id/similar', key: 'study-courses-similar' })(CourseController.similar)
router.put({ path: '/:id', key: 'study-courses-update', middlewares: [isAuthenticated] })(CourseController.update)
router.post({ path: '/', key: 'study-courses-create', middlewares: [isAuthenticated] })(CourseController.create)
router.delete({ path: '/:id', key: 'study-courses-delete', middlewares: [isAuthenticated] })(CourseController.delete)
router.post({ path: '/:id/publish', key: 'study-courses-publish', middlewares: [isAuthenticated] })(CourseController.publish)
router.post({ path: '/:id/freeze', key: 'study-courses-freeze', middlewares: [isAuthenticated] })(CourseController.freeze)
router.post({ path: '/:id/sections', key: 'study-courses-updateSections', middlewares: [isAuthenticated] })(CourseController.updateSections)

export default router
