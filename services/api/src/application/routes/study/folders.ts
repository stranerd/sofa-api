import { FolderController } from '@application/controllers/study/folders'
import { isAuthenticated } from '@application/middlewares'
import { Router } from 'equipped'

const router = new Router({ path: '/folders', groups: ['Folders'], middlewares: [isAuthenticated] })

router.get({ path: '/', key: 'study-folders-get' })(FolderController.get)
router.get({ path: '/:id', key: 'study-folders-find' })(FolderController.find)
router.post({ path: '/', key: 'study-folders-create' })(FolderController.create)
router.put({ path: '/:id', key: 'study-folders-update' })(FolderController.update)
router.put({ path: '/:id/save', key: 'study-folders-saveProp' })(FolderController.saveProp)
router.delete({ path: '/:id', key: 'study-folders-delete' })(FolderController.delete)

export default router
