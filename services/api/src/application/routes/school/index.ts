import { Router } from 'equipped'
import courses from './courses'
import departments from './departments'
import faculties from './faculties'
import institutions from './institutions'

const router = new Router({ path: '/school', groups: ['School'] })
router.nest(courses, departments, faculties, institutions)

export default router
