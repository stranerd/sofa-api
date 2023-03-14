import { openAIKey } from '@utils/environment'
import { Configuration, OpenAIApi } from 'openai'

type Message = { role: 'system' | 'user' | 'assistant', content: string }

export class AI {
	static #client = new OpenAIApi(new Configuration({ apiKey: openAIKey }))

	static async #getResponse (messages: Message[]) {
		try {
			const response = await this.#client.createChatCompletion({
				model: 'gpt-3.5-turbo', temperature: 0.3, max_tokens: 1000,
				messages
			})
			return response.data.choices.at(0)?.message?.content ?? ''
		} catch (err) {
			throw new Error('failed to generate response')
		}
	}

	static async summarizeForTitle (message: string) {
		let title = await this.#getResponse([
			{ role: 'system', content: 'You are a helpful assistant that always summarizes the question into a one phrase title, making it as short as possible' },
			{ role: 'user', content: message }
		])
		title = title.trim()
		if (title.startsWith('"')) title = title.slice(1)
		if (title.endsWith('"')) title = title.slice(0, -1)
		return title
	}

	static async replyMessage (message: string) {
		const reply = await this.#getResponse([
			{ role: 'system', content: 'You are a helpful, creative, clever, and very friendly assistant that always provides all logic behind its answers.' },
			{ role: 'user', content: 'Hello, who are you' },
			{ role: 'assistant', content: 'I am an AI created by OpenAI. How can I help you today?' },
			{ role: 'user', content: message }
		])
		if (!reply) return null
		return reply.trim()
	}
}