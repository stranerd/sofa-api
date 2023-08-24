import { createTest, PlayStatus, TestsUseCases } from '@modules/plays'
import { Coursable, QuestionsUseCases, canAccessCoursable } from '@modules/study'
import { AuthRole, BadRequestError, Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class TestController {
	static async find (req: Request) {
		const test = await TestsUseCases.find(req.params.id)
		if (!test) return null
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (test.userId !== req.authUser!.id && !isAdmin) return null
		return test
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (!isAdmin) query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TestsUseCases.get(query)
	}

	static async getQuestions (req: Request) {
		const test = await TestsUseCases.find(req.params.id)
		if (!test) throw new NotFoundError()
		if (test.status !== PlayStatus.started) throw new BadRequestError('test has not started')
		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: test.questions }],
			all: true
		})
		return test.questions.map((id) => questions.find((q) => q.id === id)!)
			.filter((q) => !!q)
			.map((q) => q.strip())
	}

	static async create (req: Request) {
		const data = validate({
			quizId: Schema.string().min(1),
		}, req.body)

		const hasAccess = await canAccessCoursable(Coursable.quiz, data.quizId, req.authUser!)
		if (!hasAccess) throw new NotAuthorizedError('cannot access this quiz')

		return await createTest(req.authUser!.id, hasAccess)
	}

	static async start (req: Request) {
		const updated = await TestsUseCases.start({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async end (req: Request) {
		const ended = await TestsUseCases.end({ id: req.params.id, userId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}
}