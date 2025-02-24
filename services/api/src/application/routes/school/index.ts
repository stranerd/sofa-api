import { Router } from 'equipped'
import { coursesRoutes } from './courses'
import { departmentsRoutes } from './departments'
import { facultiesRoutes } from './faculties'
import { institutionsRoutes } from './institutions'

const router = new Router({ path: '/school', groups: ['School'] })
router.nest()
router.add(...coursesRoutes, ...departmentsRoutes, ...facultiesRoutes, ...institutionsRoutes)

export default router
