import { Router } from 'equipped'
import messages from './messages'

const router = new Router({ path: '/meta', groups: ['Meta'] })

router.nest(messages)

export default router
