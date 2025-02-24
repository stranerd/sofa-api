import { Router } from 'equipped'
import answers from './answers'
import plays from './plays'

const router = new Router({ path: '/plays', groups: ['Plays'] })
router.nest(answers, plays)

export default router
