import { AnswerController } from '@application/controllers/plays/answers'
import { isAuthenticated } from '@application/middlewares'
import { PlayTypes } from '@modules/plays'
import { Router } from 'equipped'

const types = Object.values(PlayTypes).join('|')
const router = new Router({ path: `/:type(${types})/:typeId/answers`, groups: ['Answers'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'plays-answers-get' })(AnswerController.get)
router.get({ path: '/:id', key: 'plays-answers-find' })(AnswerController.find)
router.post({ path: '/', key: 'plays-answers-create' })(AnswerController.answer)
router.post({ path: '/end', key: 'plays-answers-end' })(AnswerController.end)
router.post({ path: '/reset', key: 'plays-answers-reset' })(AnswerController.reset)

export default router
