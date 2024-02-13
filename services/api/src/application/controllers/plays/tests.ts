import { ViewsUseCases, InteractionEntities } from '@modules/interactions'
import { createTest, TestsUseCases } from '@modules/plays'
import { Coursable, QuestionsUseCases, canAccessCoursable } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { AuthRole, BadRequestError, Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class TestController {
	static async find(req: Request) {
		const test = await TestsUseCases.find(req.params.id)
		if (!test) return null
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (test.userId !== req.authUser!.id && !isAdmin) return null
		return test
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (!isAdmin) query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TestsUseCases.get(query)
	}

	static async getQuestions(req: Request) {
		const test = await TestsUseCases.find(req.params.id)
		if (!test) throw new NotFoundError()
		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: test.questions }],
			all: true,
		})
		return test.questions
			.map((id) => questions.find((q) => q.id === id)!)
			.filter((q) => !!q)
			.map((q) => q.strip())
	}

	static async create(req: Request) {
		const data = validate(
			{
				quizId: Schema.string().min(1),
			},
			req.body,
		)

		const hasAccess = await canAccessCoursable(Coursable.quiz, data.quizId, req.authUser!, req.query.access)
		if (!hasAccess || hasAccess.isForTutors) throw new NotAuthorizedError('cannot access this quiz')
		if (!hasAccess.modes.test) throw new NotAuthorizedError('cannot create a test for this quiz')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const test = await createTest(req.authUser!.id, hasAccess)

		await ViewsUseCases.create({
			user: user.getEmbedded(),
			entity: { id: hasAccess.id, type: InteractionEntities.quizzes, userId: hasAccess.user.id },
		})

		return test
	}

	static async start(req: Request) {
		const updated = await TestsUseCases.start({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async end(req: Request) {
		const ended = await TestsUseCases.end({ id: req.params.id, userId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}
}
