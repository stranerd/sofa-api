import { ClassesController } from '@application/controllers/organizations/classes'
import { Router } from 'equipped'
import { announcementsRoutes } from './announcements'
import { classesRoutes } from './classes'
import { lessonsRoutes } from './lessons'
import { membersRoutes } from './members'
import { schedulesRoutes } from './schedules'

const router = new Router({ path: '/organizations', groups: ['Organizations'] })

router.get({ path: '/classes/explore', key: 'organizations-classes-explore' })((req) => ClassesController.get(req, true))

const organizationRouter = new Router({ path: '/:organizationId' })
organizationRouter.add(...membersRoutes, ...classesRoutes)

const classRouter = new Router({ path: '/classes/:classId' })
classRouter.add(...announcementsRoutes, ...lessonsRoutes, ...schedulesRoutes)

organizationRouter.nest(classRouter)
router.nest(organizationRouter)

export default router
