import { QuestionsUseCases } from '@modules/study'
import { appInstance } from '@utils/types'
import { Conditions, DelayedJobs } from 'equipped'
import { PlayTypes } from '../domain/types'
import { AnswersUseCases, GamesUseCases, TestsUseCases } from '..'
import { GameEntity } from '../domain/entities/games'
import { TestEntity } from '../domain/entities/tests'

export const endPlay = async (type: PlayTypes, typeId: string, userId) => {
	if (type === PlayTypes.games) await GamesUseCases.end({ id: typeId, userId })
	if (type === PlayTypes.tests) await TestsUseCases.end({ id: typeId })
}

const calculateResults = async (type: PlayTypes, typeId: string, questionIds: string[], participants: string[]) => {
	const { results: questions } = await QuestionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: questionIds }],
		all: true
	})
	const { results: answers } = await AnswersUseCases.get({
		where: [{ field: 'type', value: type }, { field: 'typeId', value: typeId }],
		all: true
	})

	const scores = Object.fromEntries(participants.map((participant) => [participant, 0]))

	questions.forEach((question) => {
		answers.forEach((answerEntity) => {
			const userId = answerEntity.userId
			if (!(question.id in answerEntity.data)) return
			const correct = question.checkAnswer(answerEntity.data[question.id])
			if (!correct) return
			scores[userId] += 10
		})
	})

	return scores
}

const startTimer = async (type: PlayTypes, typeId: string, userId: string, endedAt: number) => {
	const cacheKey = `plays-${type}-${typeId}-timer`
	const cachedJobId = await appInstance.cache.get(cacheKey)
	if (cachedJobId) return
	let endsIn = endedAt - Date.now()
	if (endsIn < 5000) endsIn = 5000
	const jobId = await appInstance.job.addDelayedJob({
		type: DelayedJobs.PlayTimer,
		data: { type, typeId, userId },
	}, endsIn)
	await appInstance.cache.set(cacheKey, jobId, Math.ceil(endsIn / 1000))
}

export const calculateGameResults = async (game: GameEntity) => {
	const scores = await calculateResults(PlayTypes.games, game.id, game.questions, game.participants)
	return await GamesUseCases.score({ id: game.id, userId: game.user.id, scores })
}

export const startGameTimer = async (game: GameEntity) => startTimer(PlayTypes.games, game.id, game.user.id,  game.endedAt ?? 0)

export const calculateTestResults = async (test: TestEntity) => {
	const scores = await calculateResults(PlayTypes.tests, test.id, test.questions, test.participants)
	return await TestsUseCases.score({ id: test.id, scores })
}

export const startTestTimer = async (test: TestEntity) => startTimer(PlayTypes.tests, test.id, '', test.endedAt ?? 0)