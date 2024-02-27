import { PlayTypes, PlaysUseCases, createPlay } from '@modules/plays'
import { Coursable, QuestionsUseCases, canAccessCoursable } from '@modules/study'
import { Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class PlayController {
	static async find(req: Request) {
		return await PlaysUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await PlaysUseCases.get(query)
	}

	static async create(req: Request) {
		const { quizId, data } = validate(
			{
				quizId: Schema.string(),
				data: Schema.discriminate((d) => d.type, {
					[PlayTypes.games]: Schema.object({
						type: Schema.is(PlayTypes.games as const),
						join: Schema.boolean().default(false),
					}).transform((d) => ({ type: PlayTypes.games, participants: d.join ? [req.authUser!.id] : [] })),
					[PlayTypes.tests]: Schema.object({
						type: Schema.is(PlayTypes.tests as const),
					}),
					[PlayTypes.flashcards]: Schema.object({
						type: Schema.is(PlayTypes.flashcards as const),
					}),
					[PlayTypes.practice]: Schema.object({
						type: Schema.is(PlayTypes.practice as const),
					}),
					[PlayTypes.assessments]: Schema.object({
						type: Schema.is(PlayTypes.assessments as const),
					}).transform(() => ({ type: PlayTypes.assessments, participants: [] })),
				}),
			},
			req.body,
		)

		const hasAccess = await canAccessCoursable(Coursable.quiz, quizId, req.authUser!, req.query.access)
		if (!hasAccess || hasAccess.isForTutors) throw new NotAuthorizedError('cannot access this quiz')

		return await createPlay(req.authUser!.id, hasAccess, data, true)
	}

	static async delete(req: Request) {
		const isDeleted = await PlaysUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async start(req: Request) {
		const updated = await PlaysUseCases.start({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async end(req: Request) {
		const ended = await PlaysUseCases.end({ id: req.params.id, userId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}

	static async getQuestions(req: Request) {
		const play = await PlaysUseCases.find(req.params.id)
		if (!play) throw new NotFoundError()
		const { results: questions } = await QuestionsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: play.questions }],
			all: true,
		})
		return play.questions
			.map((id) => questions.find((q) => q.id === id)!)
			.filter((q) => !!q)
			.map((q) => q.strip())
	}

	static async join(req: Request) {
		const { join } = validate({ join: Schema.boolean() }, req.body)
		const updated = await PlaysUseCases.join({ id: req.params.id, userId: req.authUser!.id, join })
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
