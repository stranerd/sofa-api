import { Router } from 'equipped'
import comments from './comments'
import likes from './likes'
import reports from './reports'
import reviews from './reviews'
import tags from './tags'
import views from './views'

const router = new Router({ path: '/interactions', groups: ['Interactions'] })
router.nest(comments, likes, reports, reviews, tags, views)

export default router
