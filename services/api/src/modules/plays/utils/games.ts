import { QuestionsUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { Conditions, DelayedJobs } from 'equipped'
import { AnswersUseCases, GamesUseCases } from '..'
import { GameEntity } from '../domain/entities/games'

export const calculateGameResults = async (game: GameEntity) => {
	const { results: questions } = await QuestionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: game.questions }],
		all: true
	})
	const { results: answers } = await AnswersUseCases.get({
		where: [{ field: 'gameId', value: game.id }],
		all: true
	})

	const scores = Object.fromEntries(game.participants.map((participant) => [participant, 0]))

	questions.forEach((question) => {
		answers.forEach((answerEntity) => {
			const userId = answerEntity.userId
			if (!(question.id in answerEntity.data)) return
			const correct = question.checkAnswer(answerEntity.data[question.id])
			if (!correct) return
			scores[userId] += 10
		})
	})

	return await GamesUseCases.score({ id: game.id, userId: game.user.id, scores })
}

export const startGameTimer = async (game: GameEntity) => {
	const cacheKey = `plays-games-${game.id}-timer`
	const cachedJobId = await appInstance.cache.get(cacheKey)
	if (cachedJobId) return
	let endsIn = (game.endedAt ?? 0) - Date.now()
	if (endsIn < 5000) endsIn = 5000
	const jobId = await appInstance.job.addDelayedJob({
		type: DelayedJobs.GameTimer,
		data: { gameId: game.id, userId: game.user.id },
	}, endsIn)
	await appInstance.cache.set(cacheKey, jobId, endsIn / 1000)
}