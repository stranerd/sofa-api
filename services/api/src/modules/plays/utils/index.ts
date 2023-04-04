import { appInstance } from '@utils/types'
import { DelayedJobs } from 'equipped'
import { GameEntity } from '../domain/entities/games'

export const startGameTimer = async (game: GameEntity) => {
	const cacheKey = `plays-games-${game.id}-timer`
	const cachedJobId = await appInstance.cache.get(cacheKey)
	if (cachedJobId) return
	let endsIn = (game.endedAt ?? 0) - Date.now()
	if (endsIn < 3000) endsIn = 3000
	const jobId = await appInstance.job.addDelayedJob({
		type: DelayedJobs.GameTimer,
		data: { gameId: game.id, userId: game.user.id },
	}, endsIn)
	await appInstance.cache.set(cacheKey, jobId, endsIn * 1000)
}