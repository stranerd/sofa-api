import { InteractionEntities, ViewsUseCases } from '@modules/interactions'
import { GamesUseCases } from '@modules/plays'
import { canAccessCoursable, Coursable, QuestionsUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class GameController {
	static async find (req: Request) {
		return await GamesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await GamesUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validate({
			quizId: Schema.string().min(1),
			join: Schema.boolean().default(false)
		}, req.body)

		const hasAccess = await canAccessCoursable(Coursable.quiz, data.quizId, req.authUser!)
		if (!hasAccess || hasAccess.isForTutors) throw new NotAuthorizedError('cannot access this quiz')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: hasAccess.questions }],
			all: true
		})
		const questionIds = hasAccess.questions.map((id) => questions.find((q) => q.id === id)?.id)
			.filter((q) => !!q) as string[]
		const totalTimeInSec = questions.reduce((acc, q) => acc + q.timeLimit, 0)

		const game = await GamesUseCases.add({
			quizId: data.quizId,
			user: user.getEmbedded(),
			questions: questionIds,
			totalTimeInSec
		})

		if (data.join) await GamesUseCases.join({ id: game.id, userId: game.user.id, join: true })
			.then(() => game.participants.push(game.user.id))

		await ViewsUseCases.create({
			user: user.getEmbedded(),
			entity: { id: hasAccess.id, type: InteractionEntities.quizzes, userId: hasAccess.user.id }
		})

		return game
	}

	static async delete (req: Request) {
		const isDeleted = await GamesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async join (req: Request) {
		const { join } = validate({ join: Schema.boolean() }, req.body)
		const updated = await GamesUseCases.join({ id: req.params.id, userId: req.authUser!.id, join })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async start (req: Request) {
		const updated = await GamesUseCases.start({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async end (req: Request) {
		const ended = await GamesUseCases.end({ id: req.params.id, userId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}

	static async getQuestions (req: Request) {
		const game = await GamesUseCases.find(req.params.id)
		if (!game) throw new NotFoundError()
		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: game.questions }],
			all: true
		})
		return game.questions.map((id) => questions.find((q) => q.id === id)!)
			.filter((q) => !!q)
			.map((q) => q.strip())
	}
}