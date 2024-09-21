import { Phone } from '@modules/auth'
import { publishers } from '@utils/events'
import { ApiDef, EmailsList, readEmailFromPug, Router, Schema, validate, Validation } from 'equipped'

const router = new Router({ path: '/messages', groups: ['Messages'] })

router.post<MessagesSendRouteDef>({ path: '/', key: 'meta-messages-send' })(async (req) => {
	const data = validate(
		{
			name: Schema.string(),
			email: Schema.string().email(),
			phone: Schema.any().addRule(Validation.isValidPhone()).nullable(),
			message: Schema.string().min(1),
		},
		req.body,
	)

	const content = await readEmailFromPug('emails/newFormMessage.pug', {
		...data,
		phone: data.phone ? `${data.phone.code}${data.phone.number}` : '',
	})
	await publishers.SENDMAIL.publish({
		from: EmailsList.NO_REPLY,
		to: 'support@stranerd.com',
		subject: 'New Message',
		content,
		data: {},
	})

	return true
})

export default router

type MessagesSendRouteDef = ApiDef<{
	key: 'meta-messages-send'
	method: 'post'
	body: { name: string; email: string; phone: Phone | null; message: string }
	response: boolean
}>
