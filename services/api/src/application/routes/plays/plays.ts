import { PlayController } from '@application/controllers/plays/plays'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/plays', groups: ['Plays'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'plays-get' })(PlayController.get)
router.get({ path: '/:id', key: 'plays-find' })(PlayController.find)
router.post({ path: '/', key: 'plays-create' })(PlayController.create)
router.delete({ path: '/:id', key: 'plays-delete' })(PlayController.delete)
router.post({ path: '/:id/start', key: 'plays-start' })(PlayController.start)
router.post({ path: '/:id/join', key: 'plays-join' })(PlayController.join)
router.post({ path: '/:id/end', key: 'plays-end' })(PlayController.end)
router.post({ path: '/:id/export', key: 'plays-export' })(PlayController.export)
router.get({ path: '/:id/questions', key: 'plays-questions-get' })(PlayController.getQuestions)

export default router
