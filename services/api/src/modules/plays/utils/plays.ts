import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { DelayedJobs, Validation } from 'equipped'
import { AnswersUseCases, PlaysUseCases } from '..'
import { PlayEntity } from '../domain/entities/plays'

export const calculatePlayResults = async (play: PlayEntity) => {
	const questions = play.sources
	const { results: answers } = await AnswersUseCases.get({
		where: [
			{ field: 'type', value: play.type },
			{ field: 'typeId', value: play.id },
		],
		all: true,
	})

	const scoresPool = Object.fromEntries(
		play.getActiveParticipants().map((participant) => [participant, { value: 0, at: Number.MAX_SAFE_INTEGER }]),
	)

	questions.forEach((question) => {
		answers.forEach((answer) => {
			const userId = answer.userId
			if (!(userId in scoresPool)) return
			if (!(question.id in answer.data)) return
			const correct = question.checkAnswer(answer.data[question.id].value)
			if (!correct) return
			scoresPool[userId].value += 1
			scoresPool[userId].at = answer.getLastDate()
		})
	})

	const scores = Object.entries(scoresPool)
		.sort((a, b) => {
			if (a[1].value > b[1].value) return -1
			if (a[1].value < b[1].value) return 1
			if (a[1].at < b[1].at) return -1
			if (a[1].at > b[1].at) return 1
			return 0
		})
		.map(([userId, { value }]) => ({ userId, value: parseFloat(Validation.divideByZero(value, questions.length).toFixed(6)) }))

	await PlaysUseCases.score({ id: play.id, userId: play.user.id, scores })
}

export const startPlayTimer = async (play: PlayEntity) => {
	if (!play.getUsesTimer()) return
	const cacheKey = `plays-${play.type}-${play.id}-timer`
	const cachedJobId = await appInstance.cache.get(cacheKey)
	if (cachedJobId) return
	let endsIn = play.getEndsAt() - Date.now()
	if (endsIn < 10000) endsIn = 10000
	const jobId = await appInstance.job.addDelayedJob(
		{
			type: DelayedJobs.PlayTimer,
			data: { type: play.type, typeId: play.id, userId: play.user.id },
		},
		endsIn,
	)
	await appInstance.cache.set(cacheKey, jobId, Math.ceil(endsIn / 1000))
}

export const postPlayScored = async (play: PlayEntity) => {
	await Promise.all([
		...play.getActiveParticipants().map((p) => UsersUseCases.incrementMeta({ id: p, value: 1, property: play.getUserMetaType() })),
		play.isGame() && UsersUseCases.incrementMeta({ id: play.user.id, value: 1, property: UserMeta.hostedGames }),
		play.isAssessment() && UsersUseCases.incrementMeta({ id: play.user.id, value: 1, property: UserMeta.hostedAssessments }),
	])
}
