import axios from 'axios'
import type { PhoneText } from 'equipped'
import { BadRequestError } from 'equipped'

import { isDev, termiiAPIKey } from '@utils/environment'
import { appInstance } from '@utils/types'

import { PhoneErrorsUseCases } from '../'
import { PhoneErrorEntity } from '../domain/entities/phoneErrors'

const sendText = async (text: PhoneText) => {
	await axios
		.post('https://termii.com/api/sms/send', {
			to: text.to,
			from: text.from,
			sms: text.content,
			type: 'plain',
			channel: 'generic',
			api_key: termiiAPIKey,
		})
		.catch((err) => {
			throw new BadRequestError(`Failed to send text: ${err.response.data.message}`)
		})
}

export const sendTextAndCatchError = async (text: PhoneText | PhoneErrorEntity) => {
	const parentId = text instanceof PhoneErrorEntity ? text.id : undefined
	if (text instanceof PhoneErrorEntity && text.tries >= 3) return
	if (isDev) await appInstance.logger.info(text.to, text.content)
	const successful = await sendText(text).catch(async (e) => {
		await PhoneErrorsUseCases.add({
			data: { to: text.to, from: text.from, content: text.content, error: e.message },
			parentId,
		})
		return false
	})
	if (successful && parentId) await PhoneErrorsUseCases.delete(parentId).catch(() => {})
}
