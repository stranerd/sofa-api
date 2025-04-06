import type { Email } from 'equipped'
import { EmailsList } from 'equipped'
import { createTransport } from 'nodemailer'

import { emails, isDev } from '@utils/environment'
import { appInstance } from '@utils/types'

import { EmailErrorsUseCases } from '../'
import { EmailErrorEntity } from '../domain/entities/emailErrors'

const sendMail = async (email: Email) => {
	const { to, subject, content, from = EmailsList.NO_REPLY } = email
	const { clientId, privateKey } = emails[from]

	const transporter = createTransport({
		service: 'gmail',
		auth: { type: 'OAuth2', user: from, serviceClient: clientId, privateKey },
		tls: { rejectUnauthorized: false },
	})
	await transporter.verify()

	await transporter.sendMail({
		from: `Stranerd ${from}`,
		html: content,
		to,
		subject,
	})

	return true
}

export const sendMailAndCatchError = async (email: Email | EmailErrorEntity) => {
	const parentId = email instanceof EmailErrorEntity ? email.id : undefined
	if (email instanceof EmailErrorEntity && email.tries >= 3) return
	if (isDev) await appInstance.logger.info(email.to, email.content)
	const successful = await sendMail(email).catch(async (e) => {
		await EmailErrorsUseCases.add({
			data: { to: email.to, from: email.from, content: email.content, data: email.data, subject: email.subject, error: e.message },
			parentId,
		})
		return false
	})
	if (successful && parentId) await EmailErrorsUseCases.delete(parentId).catch(() => {})
}
