import type { ApiDef } from 'equipped'
import { Router } from 'equipped'

import type { PropTypes } from '@utils/emails'
import { renderEmail } from '@utils/emails'

import { authRoutes } from './auth'
import { conversationRoutes } from './conversations'
import { interactionRoutes } from './interactions'
import { metaRoutes } from './meta'
import { notificationRoutes } from './notifications'
import { organizationsRoutes } from './organizations'
import { paymentRoutes } from './payment'
import { playRoutes } from './plays'
import { schoolRoutes } from './school'
import { studyRoutes } from './study'
import { userRoutes } from './users'

export const router = new Router()
router.add(
	...authRoutes,
	...conversationRoutes,
	...interactionRoutes,
	...metaRoutes,
	...notificationRoutes,
	...organizationsRoutes,
	...paymentRoutes,
	...playRoutes,
	...schoolRoutes,
	...studyRoutes,
	...userRoutes,
)

router.post<EmailContentTestRouteDef>({ key: 'emails-content-test', path: '/emails-content/test' })(async (req) => {
	const emailContent = await renderEmail(req.body.email as any, req.body.props)
	return req.res({
		headers: { 'Content-Type': 'text/html' },
		body: emailContent,
	})
})

type EmailContentTestRouteDef = ApiDef<{
	key: 'emails-content-test'
	method: 'post'
	body: { email: keyof PropTypes; props: Record<string, unknown> }
	response: string
	responseHeaders: { 'Content-Type': 'text/html' }
}>
