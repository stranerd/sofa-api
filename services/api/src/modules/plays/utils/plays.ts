import { QuestionsUseCases } from '@modules/study'
import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { Conditions, DelayedJobs } from 'equipped'
import { AnswersUseCases, PlaysUseCases } from '..'
import { PlayEntity } from '../domain/entities/plays'

export const calculatePlayResults = async (play: PlayEntity) => {
	const { results: unsortedQuestions } = await QuestionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: play.questions }],
		all: true,
	})
	const questions = play.questions.map((id) => unsortedQuestions.find((q) => q.id === id)!).filter(Boolean)
	const { results: answers } = await AnswersUseCases.get({
		where: [
			{ field: 'type', value: play.type },
			{ field: 'typeId', value: play.id },
		],
		all: true,
	})

	const scoresPool = Object.fromEntries(play.getActiveParticipants().map((participant) => [participant, { value: 0, at: 0 }]))

	questions.forEach((question) => {
		answers.forEach((answerEntity) => {
			const userId = answerEntity.userId
			if (!(question.id in answerEntity.data)) return
			const correct = question.checkAnswer(answerEntity.data[question.id].value)
			if (!correct) return
			scoresPool[userId].value += 1
			scoresPool[userId].at += answerEntity.endedAt ?? Number.MAX_SAFE_INTEGER
		})
	})

	const scores = Object.entries(scoresPool)
		.sort((a, b) => {
			if (a[1].value > b[1].value) return -1
			if (a[1].value < b[1].value) return 1
			if (a[1].at <= b[1].at) return -1
			return 1
		})
		.map(([userId, { value }]) => ({ userId, value: Number((questions.length ? value / questions.length : 0).toFixed(6)) }))

	await PlaysUseCases.score({ id: play.id, userId: play.user.id, scores })
}

export const startPlayTimer = async (play: PlayEntity) => {
	const cacheKey = `plays-${play.type}-${play.id}-timer`
	const cachedJobId = await appInstance.cache.get(cacheKey)
	if (cachedJobId) return
	let endsIn = play.getEndsAt() - Date.now()
	if (endsIn < 5000) endsIn = 5000
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
