import { TestsUseCases } from '@modules/plays'
import { QuestionsUseCases } from '@modules/study'
import { Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request } from 'equipped'

export class TestController {
	static async find (req: Request) {
		return await TestsUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await TestsUseCases.get(query)
	}

	static async getQuestions (req: Request) {
		const test = await TestsUseCases.find(req.params.id)
		if (!test) throw new NotFoundError()
		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: test.questions }],
			all: true
		})
		return test.questions.map((id) => questions.find((q) => q.id === id)!)
			.filter((q) => !!q)
			.map((q) => q.strip())
	}

	static async end (req: Request) {
		const ended = await TestsUseCases.end({ id: req.params.id, userId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}
}