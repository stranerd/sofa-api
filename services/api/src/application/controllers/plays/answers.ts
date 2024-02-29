import { AnswersUseCases, PlayTypes } from '@modules/plays'
import { QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class AnswerController {
	static async find(req: Request) {
		const answer = await AnswersUseCases.find(req.params.id)
		if (!answer || answer.type !== req.params.type || answer.typeId !== req.params.typeId) return null
		const authUserId = req.authUser!.id
		if (answer.userId !== authUserId && answer.typeUserId !== authUserId) return null
		return answer
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		const authUserId = req.authUser!.id
		query.authType = QueryKeys.and
		query.auth = [
			{ field: 'type', value: req.params.type },
			{ field: 'typeId', value: req.params.typeId },
			{
				condition: QueryKeys.or,
				value: [
					{ field: 'userId', value: authUserId },
					{ field: 'typeUserId', value: authUserId },
				],
			},
		]
		return await AnswersUseCases.get(query)
	}

	static async answer(req: Request) {
		const data = validate(
			{
				questionId: Schema.string().min(1),
				answer: Schema.or([
					Schema.array(Schema.number()),
					Schema.array(Schema.string()),
					Schema.boolean(),
					Schema.string(),
					Schema.null(),
				]),
			},
			req.body,
		)
		return await AnswersUseCases.answer({
			...data,
			type: req.params.type as PlayTypes,
			typeId: req.params.typeId,
			userId: req.authUser!.id,
		})
	}

	static async end(req: Request) {
		return await AnswersUseCases.end({
			type: req.params.type as PlayTypes,
			typeId: req.params.typeId,
			userId: req.authUser!.id,
		})
	}
}
