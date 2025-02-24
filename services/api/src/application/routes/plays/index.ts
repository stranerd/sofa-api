import { Router } from 'equipped'
import { answersRoutes } from './answers'
import { playsRoutes } from './plays'

const router = new Router({ path: '/plays', groups: ['Plays'] })
router.nest()
router.add(...playsRoutes, ...answersRoutes)

export default router
