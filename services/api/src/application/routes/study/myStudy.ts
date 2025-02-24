import { MyStudyController } from '@application/controllers/study/myStudy'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/my', groups: ['My'], middlewares: [isAuthenticated] })

router.get({ path: '/recent', key: 'study-my-recent' })(MyStudyController.recent)
router.get({ path: '/byMyOrgs', key: 'study-my-byMyOrgs' })(MyStudyController.byMyOrgs)
router.get({ path: '/suggested', key: 'study-my-suggested' })(MyStudyController.suggested)
router.get({ path: '/latest', key: 'study-my-latest' })(MyStudyController.latest)
router.get({ path: '/rated', key: 'study-my-rated' })(MyStudyController.rated)
router.get({ path: '/popular', key: 'study-my-popular' })(MyStudyController.popular)

export default router
