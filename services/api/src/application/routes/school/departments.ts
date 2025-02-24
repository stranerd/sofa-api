import { DepartmentController } from '@application/controllers/school/departments'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/departments', groups: ['Departments'] })

router.get({ path: '/', key: 'school-departments-get' })(DepartmentController.get)
router.get({ path: '/:id', key: 'school-departments-find' })(DepartmentController.find)
router.post({ path: '/', key: 'school-departments-create', middlewares: [isAuthenticated, isAdmin] })(DepartmentController.create)
router.put({ path: '/:id', key: 'school-departments-update', middlewares: [isAuthenticated, isAdmin] })(DepartmentController.update)
router.delete({ path: '/:id', key: 'school-departments-delete', middlewares: [isAuthenticated, isAdmin] })(DepartmentController.delete)

export default router
