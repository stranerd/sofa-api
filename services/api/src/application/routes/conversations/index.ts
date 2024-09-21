import { Router } from 'equipped'
import conversations from './conversations'
import messages from './messages'

const router = new Router({ path: '/conversations', groups: ['Conversations'] })
router.nest(conversations, messages)

export default router
