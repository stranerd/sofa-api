import { publishers } from '@utils/events'
import { EmailsList, Request, Schema, readEmailFromPug, validate } from 'equipped'

export class MessageController {
	static async createMessage(req: Request) {
		const data = validate(
			{
				message: Schema.string().min(1),
			},
			req.body,
		)

		const content = await readEmailFromPug('emails/newFormMessage.pug', {
			message: data.message,
		})
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
