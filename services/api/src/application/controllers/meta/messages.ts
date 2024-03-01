import { publishers } from '@utils/events'
import { EmailsList, Request, Schema, readEmailFromPug, validate } from 'equipped'

export class MessageController {
	static async createMessage(req: Request) {
		const data = validate(
			{
				name: Schema.string(),
				email: Schema.string().email(),
				phone: Schema.string(),
				message: Schema.string().min(1),
			},
			req.body,
		)

		const content = await readEmailFromPug('emails/newFormMessage.pug', data)
		await publishers.SENDMAIL.publish({
			from: EmailsList.NO_REPLY,
			to: 'support@stranerd.com',
			subject: 'New Message',
			content,
			data: {},
		})

		return true
	}
}
