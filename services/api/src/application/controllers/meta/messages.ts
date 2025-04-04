import { renderEmail } from '@utils/emails'
import { publishers } from '@utils/events'
import { EmailsList, Request, Schema, validate, Validation } from 'equipped'

export class MessageController {
	static async createMessage(req: Request) {
		const data = validate(
			{
				name: Schema.string(),
				email: Schema.string().email(),
				phone: Schema.any().addRule(Validation.isValidPhone()).nullable(),
				message: Schema.string().min(1),
			},
			req.body,
		)

		const content = await renderEmail('NewFormMessage', {
			...data,
			phone: data.phone ? `${data.phone.code}-${data.phone.number}` : '',
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
