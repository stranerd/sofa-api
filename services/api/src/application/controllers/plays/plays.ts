import type { QueryParams, Request } from 'equipped'
import { AuthRole, Conditions, NotAuthorizedError, NotFoundError, QueryKeys, Schema, Validation, validate } from 'equipped'

import { PlayEntity, PlayStatus, PlayTypes, PlaysUseCases, createPlay } from '@modules/plays'
import { Coursable, canAccessCoursable } from '@modules/study'
import { UserEntity, UsersUseCases } from '@modules/users'

const publicTypes = [PlayTypes.games, PlayTypes.assessments]

export class PlayController {
	static async find(req: Request) {
		const play = await PlaysUseCases.find(req.params.id)
		if (!play || publicTypes.includes(play.data.type)) return play
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (play.isTutorTest() && isAdmin) return play
		return play.getMembers().includes(req.authUser!.id) ? play : null
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'data.type', condition: Conditions.in, value: publicTypes },
			{ field: 'user.id', value: req.authUser!.id },
		]
		const isAdmin = req.authUser?.roles?.[AuthRole.isAdmin] || req.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (isAdmin) query.auth.push({ field: 'data.forTutors', value: true })
		return await PlaysUseCases.get(query)
	}

	static async create(req: Request) {
		const { title, quizId, data } = validate(
			{
				title: Schema.string().min(1),
				quizId: Schema.string(),
				data: Schema.discriminate((d) => d.type, {
					[PlayTypes.games]: Schema.object({
						type: Schema.is(PlayTypes.games as const),
						join: Schema.boolean().default(false),
					}).transform((d) => ({ type: PlayTypes.games as const, participants: d.join ? [req.authUser!.id] : [] })),
					[PlayTypes.tests]: Schema.object({
						type: Schema.is(PlayTypes.tests as const),
					}).transform((d) => ({ ...d, forTutors: false })),
					[PlayTypes.flashcards]: Schema.object({
						type: Schema.is(PlayTypes.flashcards as const),
					}),
					[PlayTypes.practice]: Schema.object({
						type: Schema.is(PlayTypes.practice as const),
					}),
					[PlayTypes.assessments]: Schema.object({
						type: Schema.is(PlayTypes.assessments as const),
						endedAt: Schema.time().min(Date.now()).asStamp(),
					}).transform((d) => ({ ...d, participants: [] })),
				}),
			},
			req.body,
		)

		const hasAccess = await canAccessCoursable(Coursable.quiz, quizId, req.authUser!, req.query.access)
		if (!hasAccess || hasAccess.isForTutors) throw new NotAuthorizedError('cannot access this quiz')
		if (!hasAccess.modes[data.type]) throw new NotAuthorizedError(`cannot create ${data.type} for this quiz`)

		return await createPlay(req.authUser!.id, hasAccess, { title }, data, true)
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
		return play.sources.map((q) => q.strip())
	}

	static async getCorrections(req: Request) {
		const play = await PlaysUseCases.find(req.params.id)
		if (!play) throw new NotFoundError()
		if (!play.endedAt) throw new NotAuthorizedError()
		return play.sources
	}

	static async join(req: Request) {
		const { join } = validate({ join: Schema.boolean() }, req.body)
		const updated = await PlaysUseCases.join({ id: req.params.id, userId: req.authUser!.id, join })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async formatForExport (plays: PlayEntity[]) {
		const participants = [...new Set(
			plays.flatMap((play) => play.scores.map((score) => score.userId))
		)]
		const { results: users } = await UsersUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: participants }],
			all: true,
		})
		const usersMap = Object.fromEntries(users.map((u) => [u.id, u]))

		const columns = ['S/N', 'Name', 'Email', 'Phone', 'Location', 'Play', 'Score']

		const rows = Object.values(plays.flatMap((play) => play.scores
					.map((score) => {
						const user = usersMap[score.userId]
						return user ? { user, score, play } : null!
					})
			.filter((u) => !!u))
			.reduce<Record<string, { user: UserEntity, score: { value: number } , play: PlayEntity }>>((acc, cur) => {
				if (acc[cur.user.id] && acc[cur.user.id].score.value > cur.score.value) return acc
				return { ...acc, [cur.user.id]: cur }
			}, {}))
			.sort((a, b) => b.score.value - a.score.value)
			.map(({ user, score, play }, i) => [
				`${i + 1}`,
				user.bio.name.full,
				user.bio.email,
				user.bio.phone ? `${user.bio.phone.code}-${user.bio.phone.number}` : '',
				user.location ? `${user.location.state}, ${user.location.country}` : '',
				`${Validation.capitalize(play.title)}(#${play.id})`,
				(score.value * 100).toFixed(2)
		])

		return [columns, ...rows].map((row) => row.map((i) => i.replaceAll(',', '-')).join(',')).join('\n')
	}

	static async export(req: Request) {
		const play = await PlaysUseCases.find(req.params.id)
		if (!play || play.status !== PlayStatus.scored || play.user.id !== req.authUser!.id) throw new NotAuthorizedError()

		const result = await PlayController.formatForExport([play])
		return req.res({
			body: result,
			headers: { 'Content-Type': 'text/csv' }
		})
	}

	static async adminExport (req: Request) {
		const { results: plays } = await PlaysUseCases.get(req.body as QueryParams)
		const result = await PlayController.formatForExport(plays)
		return req.res({
			body: result,
			headers: { 'Content-Type': 'text/csv' }
		})
	}
}
