import { Router } from 'equipped'
import notifications from './notifications'
import push from './push'

const router = new Router({ path: '/notifications', groups: ['Notifications'] })

router.nest(notifications, push)

export default router
