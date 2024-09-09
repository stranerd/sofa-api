import { openAIKey } from '@utils/environment'
import { BadRequestError } from 'equipped'
import OpenAI from 'openai'

type Message = { role: 'system' | 'user' | 'assistant'; content: string }

export class AI {
	static #client = new OpenAI({ apiKey: openAIKey })

	static async #getResponse(options: Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, 'model'>) {
		try {
			const response = await this.#client.chat.completions.create({
				temperature: 0.2,
				...options,
				model: 'gpt-4o',
			})
			return response.choices.at(0)?.message?.content?.trim() ?? ''
		} catch (err) {
			throw new BadRequestError('failed to generate response')
		}
	}

	static async summarizeForTitle(message: string) {
		let title = await this.#getResponse({
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that always summarizes the question into a one phrase title, making it as short as possible',
				},
				{ role: 'user', content: message },
			],
		})
		if (title.startsWith('"')) title = title.slice(1)
		if (title.endsWith('"')) title = title.slice(0, -1)
		return title
	}

	static async replyMessage(messages: Message[]) {
		const reply = await this.#getResponse({
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful, creative, clever, and very friendly assistant that always provides all logic behind its answers.',
				},
				{ role: 'user', content: 'Hello, who are you' },
				{ role: 'assistant', content: 'I am an AI created by OpenAI. How can I help you today?' },
				...messages,
			],
		})
		if (!reply) return null
		return reply
	}

	static async generateQuestion<T>(prompt: string, schema: Record<string, unknown>) {
		const response = await this.#getResponse({
			messages: [{ role: 'user', content: prompt }],
			response_format: { type: 'json_schema', json_schema: { name: 'question-schema', strict: true, schema } },
		})
		return response ? (JSON.parse(response) as T) : null
	}
}
