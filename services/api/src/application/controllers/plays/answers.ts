import { AnswersUseCases } from '@modules/plays'
import { QueryParams, Request, Schema, validate } from 'equipped'

export class AnswerController {
	static async find (req: Request) {
		const answer = await AnswersUseCases.find(req.params.id)
		if (!answer || answer.gameId !== req.params.gameId) return null
		return answer
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'gameId', value: req.params.gameId }]
		return await AnswersUseCases.get(query)
	}

	static async answer (req: Request) {
		const data = validate({
			questionId: Schema.string().min(1),
			answer: Schema.or([
				Schema.array(Schema.number()),
				Schema.boolean(),
				Schema.string().min(1),
				Schema.array(Schema.string())
			])
		}, req.body)
		return await AnswersUseCases.answer({ ...data, gameId: req.params.gameId, userId: req.authUser!.id })
	}
}