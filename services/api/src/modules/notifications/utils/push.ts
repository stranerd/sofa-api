import { appInstance, PushNotification } from '@utils/types'
import { messaging } from 'firebase-admin'
import { TokensUseCases } from '../'
import { Validation } from 'equipped'

export const sendPushNotification = async (notification: PushNotification) => {
	try {
		const { userIds, data, title, body } = notification
		await Promise.all(userIds.map(async (userId) => {
			const userTokens = await TokensUseCases.find({ userId })
			const chunks = Validation.chunkArray(userTokens.tokens, 500)
			const invalidTokens = [] as string[]

			await Promise.all(chunks.map(async (tokens) => {
				const res = await messaging().sendEachForMulticast({
					tokens,
					notification: { title, body },
					data: { value: JSON.stringify(data) }
				})
				res.responses.forEach((resp, index) => {
					if (resp.success) return
					const err = resp.error!
					const invalids = [
						'messaging/invalid-argument',
						'messaging/invalid-registration-token',
						'messaging/registration-token-not-registered'
					]
					if (invalids.includes(err.code)) invalidTokens.push(tokens[index])
					else appInstance.logger.error(err)
				})
			}))

			if (invalidTokens.length) await TokensUseCases.update({
				userId, tokens: invalidTokens, add: false
			})
		}))
	} catch (err) {
		await appInstance.logger.error(err)
	}
}
