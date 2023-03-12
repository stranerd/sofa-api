import { openAIKey } from '@utils/environment'
import { Configuration, OpenAIApi } from 'openai'

export class AI {
	static #client = new OpenAIApi(new Configuration({ apiKey: openAIKey }))

	static async #getResponse (prompt: string) {
		try {
			const response = await this.#client.createCompletion({
				model: 'text-davinci-003', temperature: 0.3, max_tokens: 1000,
				prompt
			})
			return response.data.choices.at(0)?.text ?? ''
		} catch (err) {
			throw new Error('failed to generate response')
		}
	}

	static async summarizeForTitle (text: string) {
		let title = await this.#getResponse(`Making it as short as possible, summarize the following text into a one phrase title: ${text}`)
		title = title.trim()
		if (title.startsWith('"')) title = title.slice(1)
		if (title.endsWith('"')) title = title.slice(0, -1)
		return title
	}

	static async replyMessage (message: string) {
		const prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly and always provides all logic behind its answers..

Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: ${message}
AI: `

		const reply = await this.#getResponse(prompt)
		if (!reply) return null
		return reply.trim()
	}
}