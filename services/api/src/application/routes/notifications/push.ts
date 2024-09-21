import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { ApiDef, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/push', groups: ['Push'], middlewares: [isAuthenticated] })

router.post<NotificationsPushEnableRouteDef>({ path: '/enable', key: 'notifications-push-enable' })(async (req) => {
	const { enable } = validate({ enable: Schema.boolean() }, req.body)
	const user = await UsersUseCases.updateSettings({ userId: req.authUser!.id, settings: { notifications: enable } })
	return !!user
})

router.post<NotificationsPushSubscribeRouteDef>({ path: '/devices/subscribe', key: 'notifications-push-subscribe' })(async (req) => {
	const { token } = validate({ token: Schema.string().min(1) }, req.body)
	const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: true })
	return !!res
})

router.post<NotificationsPushUnsubscribeRouteDef>({ path: '/devices/unsubscribe', key: 'notifications-push-unsubscribe' })(async (req) => {
	const { token } = validate({ token: Schema.string().min(1) }, req.body)
	const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
	return !!res
})

export default router

type NotificationsPushEnableRouteDef = ApiDef<{
	key: 'notifications-push-enable'
	method: 'post'
	body: { enable: boolean }
	response: boolean
}>

type NotificationsPushSubscribeRouteDef = ApiDef<{
	key: 'notifications-push-subscribe'
	method: 'post'
	body: { token: string }
	response: boolean
}>

type NotificationsPushUnsubscribeRouteDef = ApiDef<{
	key: 'notifications-push-unsubscribe'
	method: 'post'
	body: { token: string }
	response: boolean
}>
