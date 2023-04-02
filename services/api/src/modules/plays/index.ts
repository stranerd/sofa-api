import { GameRepository } from './data/repositories/games'
import { GamesUseCase } from './domain/useCases/games'

const gameRepository = GameRepository.getInstance()

export const GamesUseCases = new GamesUseCase(gameRepository)