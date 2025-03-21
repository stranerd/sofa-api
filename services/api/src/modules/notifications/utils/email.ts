import { emails, isDev } from '@utils/environment'
import { appInstance } from '@utils/types'
import { Email, EmailsList } from 'equipped'
import { createTransport } from 'nodemailer'
import { EmailErrorsUseCases } from '../'

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
}

export const sendMailAndCatchError = async (email: Email) => {
	try {
		if (isDev) await appInstance.logger.info(email.to, email.content)
		await sendMail(email)
	} catch (e) {
		await EmailErrorsUseCases.add({
			...email,
			error: (e as Error).message,
		})
	}
}
