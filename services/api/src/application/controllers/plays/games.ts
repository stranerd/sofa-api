import { GamesUseCases } from '@modules/plays'
import { canAccessCoursable, Coursable } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

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
		}, req.body)

		const hasAccess = await canAccessCoursable(Coursable.quiz, data.quizId, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access this quiz')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		return await GamesUseCases.add({
			quizId: data.quizId,
			user: user.getEmbedded(),
			questions: hasAccess.questions
		})
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
}