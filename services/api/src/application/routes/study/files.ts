import { FileController } from '@application/controllers/study/files'
import { isAuthenticated } from '@application/middlewares'
import axios from 'axios'
import { BadRequestError, Router } from 'equipped'

const router = new Router({ path: '/files', groups: ['Files'] })

router.get({ path: '/', key: 'study-files-get' })(FileController.get)
router.get({ path: '/:id', key: 'study-files-find' })(FileController.find)
router.post({ path: '/', key: 'study-files-create', middlewares: [isAuthenticated] })(FileController.create)
router.put({ path: '/:id', key: 'study-files-update', middlewares: [isAuthenticated] })(FileController.update)
router.delete({ path: '/:id', key: 'study-files-delete', middlewares: [isAuthenticated] })(FileController.delete)
router.post({ path: '/:id/publish', key: 'study-files-publish', middlewares: [isAuthenticated] })(FileController.publish)
router.get({ path: '/:id/media', key: 'study-files-media' })(async (req) => {
	const media = await FileController.media(req)
	const response = await axios.get(media.link, { baseURL: '', responseType: 'stream' }).catch(() => {
		throw new BadRequestError('failed to fetch file')
	})
	return req.pipe(response.data.pipe)
})

export default router
