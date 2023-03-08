import axios from 'axios'
import { mailchimpConfig } from '@utils/environment'
import { appInstance } from '@utils/types'

export const subscribeToMailingList = async (email: string) => {
	const body = {
		members: [
			{ email_address: email, status: 'subscribed' }
		]
	}
	const bodyJSON = JSON.stringify(body)
	const { audienceId, apiKey, dataCenter } = mailchimpConfig
	const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}`

	try {
		await axios.post(url, bodyJSON, { headers: { Authorization: `auth ${apiKey}` } })
	} catch (error) {
		await appInstance.logger.error('Mailchimp error:', error)
	}
}
